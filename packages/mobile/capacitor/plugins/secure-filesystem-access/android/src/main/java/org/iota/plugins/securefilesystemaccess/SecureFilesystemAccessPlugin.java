package org.iota.plugins.securefilesystemaccess;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.FileUtils;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import androidx.annotation.RequiresApi;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Objects;

import static android.os.Environment.DIRECTORY_DOWNLOADS;

@CapacitorPlugin(
        name = "SecureFilesystemAccess",
        permissions = {
                @Permission(
                        alias = "storage",
                        strings = {
                                Manifest.permission.READ_EXTERNAL_STORAGE,
                                Manifest.permission.WRITE_EXTERNAL_STORAGE
                        }
                )
        }
)

public class SecureFilesystemAccessPlugin extends Plugin {
    private String resourceType = "";
    private String fileName = "";

    @PluginMethod
    public void finishBackup(PluginCall call) {
        call.setKeepAlive(false);
        call.resolve();
    }

    @PluginMethod
    public void showPicker(PluginCall call) {
        if (getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "pickerPermsCallback");
        } else {
            if (!call.getData().has("type")) {
                call.reject("Resource type and defaultPath are required");
                return;
            }
            resourceType = call.getString("type");
            fileName = call.getString("defaultPath");
            if (resourceType == null) {
                call.reject("Resource type is null");
                return;
            }

            if (Build.VERSION.SDK_INT <= 32 && resourceType.equals("folder")) {
                String selectedPath = getContext().getCacheDir().getPath() + File.separator + fileName;
                String authority = getContext().getPackageName() + ".fileprovider";
                File file = new File(Uri.parse(selectedPath).getPath());
                Uri fileUrl = FileProvider.getUriForFile(getActivity(), authority, file);
                Intent shareIntent = new Intent();
                shareIntent.setAction(Intent.ACTION_SEND);
                shareIntent.putExtra(Intent.EXTRA_STREAM, fileUrl);
                shareIntent.setData(fileUrl);
                shareIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                getContext().startActivity(Intent.createChooser(shareIntent, null));

                JSObject response = new JSObject();
                response.put("selected", selectedPath);
                call.resolve(response);
                return;
            }

            Intent intent = new Intent(resourceType.equals("file")
                    ? Intent.ACTION_OPEN_DOCUMENT : Intent.ACTION_OPEN_DOCUMENT_TREE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            if (resourceType.equals("file")) {
                intent.setType("*/*");
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);
            }

            try {
                startActivityForResult(call, intent, "pickResult");
            } catch (Exception e) {
                Log.e("showPicker", "Intent failed!");
            }
        }
    }

    @RequiresApi(api = 26)
    @ActivityCallback
    private void pickResult(PluginCall call, ActivityResult result) throws Exception {
        // For Android we need to make sure that we remove any previous tmp file
        // otherwise the next import will not work on next start
        File tmpStronghold = new File(getContext().getCacheDir(), "temp.stronghold");
        if (tmpStronghold.exists()) {
            tmpStronghold.delete();
        }
        call.setKeepAlive(true);
        JSObject response = new JSObject();
        Intent data = result.getData();
        int takeFlagRead = Intent.FLAG_GRANT_READ_URI_PERMISSION;
        ContentResolver resolver = getContext().getContentResolver();

        if (resourceType.equals("file")) {
            if (data == null) throw new AssertionError();
            resolver.takePersistableUriPermission(data.getData(), takeFlagRead);
            // TODO when the path is not Downloads directory we don't need split and fails!
            Log.e("uri.getPath", data.getData().getPath());
            Log.e("buildPath", buildPath(data.getData().getPath()));
            if (Build.VERSION.SDK_INT <= 28) {
                String selected = data.getData().getPath().split(":")[1];
                Log.e("selected", selected);
                response.put("selected", selected);
            } else {
                File copiedFile = new File(getContext().getCacheDir(), "temp.stronghold");
                FileInputStream input;
                ParcelFileDescriptor sourceFD;
                try {
                    sourceFD = resolver.openFileDescriptor(data.getData(), "r", null);
                    input = new FileInputStream(sourceFD.getFileDescriptor());
                    ParcelFileDescriptor targetFD = resolver.openFileDescriptor(
                            Uri.fromFile(copiedFile), "w", null);
                    FileOutputStream output = new FileOutputStream(targetFD.getFileDescriptor());
                    FileUtils.copy(sourceFD.getFileDescriptor(), targetFD.getFileDescriptor());
                    input.close();
                    output.close();
                    // resolver.delete(Uri.fromFile(copiedFile), null, null);
                } catch (Exception e) {
                    throw  new Exception("Unable to write file - " + e.getMessage());
                }
                Log.e("selected", copiedFile.toString());
                response.put("selected", copiedFile.toString());
            }

        }
        call.resolve(response);
    }

    // TODO warn the user with a popup that needs to create a folder in Downloads
    private String buildPath(String path) {
        // external storage resides on a physical volume that the user might be able to remove.
        boolean isWritable = Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
        boolean isReadable = Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED) ||
                Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED_READ_ONLY);
        if (!isReadable && !isWritable) {
            return "Storage is not available";
        }
        if (!path.contains(":")) return ""; // user must select again, stronghold shows error
        String segment = path.split(":")[1];
        if (Build.VERSION.SDK_INT <= 28) {
            return segment;
        }

        int slashIndex = segment.indexOf("/");
        if (slashIndex == -1) return "";
        String finalPath = segment.substring(slashIndex);
        String beginPath = segment.substring(0, slashIndex);

        if (!beginPath.equals(DIRECTORY_DOWNLOADS)) return "";
        File downloadsPath = Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS);
        return downloadsPath.getPath() + finalPath;
    }

    @PermissionCallback
    private void pickerPermsCallback(PluginCall call) {
        if (getPermissionState("storage") == PermissionState.GRANTED) {
            showPicker(call);
        } else {
            JSObject response = new JSObject();
            response.put("selected", "");
            call.resolve(response);
        }
    }

    public static String getPath(ContentResolver resolver, Uri uri) {
        if (uri.getScheme().equals("file")) {
            return uri.getPath();
        }
        final Cursor cursor = resolver.query(uri, new String[]{"_data"}, null, null, null);
        if (cursor.moveToFirst()) {
            String path = cursor.getString(0);
            cursor.close();
            return path;
        }
        throw new RuntimeException("Can't retrieve path from uri: " + uri.toString());
    }

    @PluginMethod
    public void saveTextFile(PluginCall call) throws IOException {
        if (!call.getData().has("textContent")
                || !call.getData().has("fileName")) {
            call.reject("textContent & fileName are required");
            return;
        }
        String fileName = call.getString("fileName");
        fileName = fileName != null ? fileName : "test";
        String textContent = call.getString("textContent");
        textContent = textContent != null ? textContent : "test";
        String selectedPath = getContext().getCacheDir().getPath() + File.separator + fileName;

        try {
            File textFile = new File(selectedPath);
            FileWriter writer = new FileWriter(textFile);
            writer.append(textContent);
            writer.flush();
            writer.close();

            String authority = getContext().getPackageName() + ".fileprovider";
            Uri fileUrl = FileProvider.getUriForFile(getActivity(), authority, textFile);
            Intent shareIntent = new Intent();
            shareIntent.setAction(Intent.ACTION_SEND);
            shareIntent.putExtra(Intent.EXTRA_STREAM, fileUrl);
            shareIntent.setData(fileUrl);
            shareIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getContext().startActivity(Intent.createChooser(shareIntent, null));

        } catch (IOException e) {
            e.printStackTrace();
        }

        call.resolve();
    }

    @PluginMethod
    public void removeProfileFolder(PluginCall call) throws IOException {
        if (!call.getData().has("folder")) {
            call.reject("folder is required");
            return;
        }
        String folder = call.getString("folder");
        assert folder != null;
        File toDelete = new File(getContext().getFilesDir(), folder);
        deleteRecursively(toDelete);
        call.resolve();
    }

    public void deleteRecursively(File file) throws IOException {
        boolean isDeleted;
        if (file.isFile()) {
            isDeleted = file.delete();
            if (!isDeleted) {
                throw new IOException("Can't delete file");
            }
            return;
        }
        for (File f : Objects.requireNonNull(file.listFiles())) {
            deleteRecursively(f);
        }
        isDeleted = file.delete();
        if (!isDeleted) {
            throw new IOException("Can't delete folder");
        }
    }

    @PluginMethod
    public void renameProfileFolder(PluginCall call) {
        if (!call.getData().has("oldName")
                || !call.getData().has("newName")) {
            call.reject("newName is required");
            return;
        }
        String oldName = call.getString("oldName");
        String newName = call.getString("newName");
        assert oldName != null;
        File oldFilename = new File(getContext().getFilesDir(), oldName);
        assert newName != null;
        File newFilename = new File(getContext().getFilesDir(), newName);
        boolean isRenamed = false;
        String error = "";
        try {
            isRenamed = oldFilename.renameTo(newFilename);
        } catch (Exception e) {
            error = Objects.requireNonNull(e.getCause()).toString();
        }
        if (isRenamed) {
            call.resolve();
        } else {
            call.reject(error);
        }
    }

    @PluginMethod
    public void listProfileFolders(PluginCall call) {
        if (!call.getData().has("folder")) {
            call.reject("folder is required");
            return;
        }
        String folder = call.getString("folder");
        String[] files = null;
        File fileObject = new File(getContext().getFilesDir(), "__storage__" + File.separator + folder);
        if (fileObject.exists()) {
            files = fileObject.list();
        } else {
            call.reject("Folder does not exist");
        }
        JSObject response = new JSObject();
        response.put("folderList", files);
        call.resolve(response);
    }



}
