package org.iota.plugins.securefilesystemaccess;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.util.Log;

import androidx.activity.result.ActivityResult;

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
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.Objects;

import static android.os.Environment.DIRECTORY_ALARMS;
import static android.os.Environment.DIRECTORY_AUDIOBOOKS;
import static android.os.Environment.DIRECTORY_DCIM;
import static android.os.Environment.DIRECTORY_DOCUMENTS;
import static android.os.Environment.DIRECTORY_DOWNLOADS;
import static android.os.Environment.DIRECTORY_MOVIES;
import static android.os.Environment.DIRECTORY_MUSIC;
import static android.os.Environment.DIRECTORY_NOTIFICATIONS;
import static android.os.Environment.DIRECTORY_PICTURES;
import static android.os.Environment.DIRECTORY_PODCASTS;
import static android.os.Environment.DIRECTORY_RINGTONES;

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
        if (Build.VERSION.SDK_INT == 29) {
            final Mediastore implementation = new Mediastore();
            try {
                implementation.saveToDownloads(
                        bridge.getActivity().getApplicationContext(),
                        fileName,
                        selectedPath
                );
            } catch (Exception e) {
                call.reject(e.toString());
            }
        }
    }

    @PluginMethod
    public void saveRecoveryKit(PluginCall call) throws IOException {
        if (!call.getData().has("selectedPath")
                || !call.getData().has("fromRelativePath")) {
            call.reject("selectedPath & fromRelativePath are required");
            return;
        }
        String selectedPath = call.getString("selectedPath");
        String fromRelativePath = call.getString("fromRelativePath");

        assert fromRelativePath != null;
        File srcUrl = new File(getDirectory(DIRECTORY_DOWNLOADS).toString(), fromRelativePath);
        Log.d("srcUrl", srcUrl.toString());
        assert selectedPath != null;
        File dstUrl = new File(selectedPath);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            // copy file
            try (
                FileChannel source = new FileInputStream(srcUrl).getChannel();
                FileChannel destination = new FileOutputStream(dstUrl).getChannel()
            ) {
                destination.transferFrom(source, 0, source.size());
            }
        } else {
            final Mediastore implementation = new Mediastore();
            String path = selectedPath;
            if (path.startsWith("file:///")) {
                path = path.substring(8);
            }
            Log.d("PATH!!!", path);
            try {
                implementation.saveToDownloads(bridge.getActivity().getApplicationContext(), fileName, path);
            } catch (Exception e) {
                call.reject(e.toString());
                return;
            }
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

    @PluginMethod
    public void showPicker(PluginCall call) {
        if (getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "pickerPermsCallback");
        } else {
            if (!call.getData().has("type") || !call.getData().has("defaultPath")) {
                call.reject("Resource type and defaultPath are required");
                return;
            }
            resourceType = call.getString("type");
            fileName = call.getString("defaultPath");
            if (resourceType == null) {
                call.reject("Resource type is null");
                return;
            }
            if (Build.VERSION.SDK_INT == 29) {
                // Temporary hotfix for Android 10, it's uses new storage later deprecated on API 30,
                // We don't show the picker, as Stronghold can only copy on cache, then we copy
                // on Downloads folder calling finishBackup() to give to the user an accessible location
                JSObject response = new JSObject();
                selectedPath = getContext().getCacheDir().getPath() + File.separator + fileName;
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

            } else if (resourceType.equals("folder")) {
                intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
                intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI,
                            getContext().getExternalFilesDir(DIRECTORY_DOWNLOADS));
                }
            }

            try {
                startActivityForResult(call, intent, "pickResult");
            } catch (Exception e) {
                Log.e("showPicker", "Intent failed!");
            }
        }
    }

    @ActivityCallback
    private void pickResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }
        JSObject response = new JSObject();
        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            response.put("selected", "");
        } else {
            Intent data = result.getData();

            if (resourceType.equals("file")) {
                int takeFlags = Intent.FLAG_GRANT_READ_URI_PERMISSION;
                ContentResolver resolver = getContext().getContentResolver();
                assert data != null;
                resolver.takePersistableUriPermission(data.getData(), takeFlags);
                System.out.println("selected path :: " + data.getData().normalizeScheme());
                // TODO when the path is not Downloads directory we don't need split and fails!
                String[] segments = data.getData().getPath().split(":");
                String selected = segments[1];
                response.put("selected", selected);
                
            } else if (resourceType.equals("folder")) {
            if (data == null) throw new AssertionError();
            resolver.takePersistableUriPermission(data.getData(), takeFlagWrite);
            final Uri treeUri = data.getData();
            response.put("selected", buildPath(treeUri.getPath()) + File.separator + fileName);
        }
        call.resolve(response);
        }
    }
    
    private String buildPath(String path) {
        boolean isExternalStorageWritable = Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
        boolean isExternalStorageReadable = Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED) ||
                Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED_READ_ONLY);
        // external storage resides on a physical volume that the user might be able to remove.
        if (!isExternalStorageReadable && !isExternalStorageWritable) {
            return "Storage is not available";
        }

        if (path.contains(":")) {
            String[] segments = path.split(":");
            String finalPath = "";
            String beginPath = "";
            if (Build.VERSION.SDK_INT <= 28) {
                // TODO warn the user with a popup that needs to create a folder in Downloads
                return finalPath;
            }

            int slashIndex = segments[1].indexOf("/");
            if (slashIndex != -1) {
                finalPath = segments[1].substring(slashIndex);
                beginPath = segments[1].substring(0, slashIndex);
            }
            File appPath;
            if (beginPath.equals(DIRECTORY_DOCUMENTS) | beginPath.equals(DIRECTORY_DOWNLOADS)) {
                appPath = Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS);
            } else {
                return "";
            }
            return appPath.getPath() + finalPath; 
        }
        // user must select again, stronghold shows error
        return "";
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

}
