package org.iota.plugins.securefilesystemaccess;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;

import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;

import com.getcapacitor.FileUtils;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;

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

    @PluginMethod
    public void getFileUrlForUri(PluginCall call){
        JSObject response = new JSObject();

        try {
            String filepath = FileUtils.getFileUrlForUri(getContext(), Uri.parse(call.getString("uri")));

            response.put("filepath", filepath);

            call.resolve(response);
        }catch (Exception err){
            call.reject(err.getMessage());
        }
    }

    @PluginMethod
    public void shareFile(PluginCall call) {
        try {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Uri fileURI = FileProvider.getUriForFile(
                getContext(),
                getContext().getApplicationContext().getPackageName() + ".provider",
                new File(Uri.parse(call.getString("filepath")).getPath())
            );

            intent.putExtra(Intent.EXTRA_STREAM, fileURI);
            intent.setType("*/*");
            getActivity().startActivity(Intent.createChooser(intent, "Share file via..."));
        }catch (Exception ex){}
    }

    @PluginMethod
    public void showPicker(PluginCall call){
        if (getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "pickerPermsCallback");
        } else {
            if (!call.getData().has("type")) {
                call.reject("Resource type is required");
                return;
            }
            String resourceType = call.getString("type");
            assert resourceType != null;
            Intent intent = new Intent(resourceType.equals("file") 
                ? Intent.ACTION_OPEN_DOCUMENT : Intent.ACTION_OPEN_DOCUMENT_TREE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            String type = resourceType.equals("file") ? "*/*.stronghold" : "*/*";
            intent.setType(type);
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);

            startActivityForResult(call, intent, "pickResult");
        }
    }

    @ActivityCallback
    private void pickResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.reject("Activity canceled");
        } else {
            Intent data = result.getData();
            assert data != null;
            Uri resourcePath = data.getData();
            JSObject response = new JSObject();
            response.put("selected", resourcePath.toString());
            call.resolve(response);
        }
    }

    @PermissionCallback
    private void pickerPermsCallback(PluginCall call) {
        if (getPermissionState("storage") == PermissionState.GRANTED) {
            launchPicker(call);
        } else {
            call.reject("Permission is required to take a picture");
        }
    }

    @PluginMethod
    public void launchFilePicker(PluginCall call){
        if (getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "pickerPermsCallback");
        } else {
            launchPicker(call);
        }
    }

    @PluginMethod
    public void launchFolderPicker(PluginCall call){
        if (getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "pickerPermsCallback");
        } else {
            launchPickerFolder(call);
        }
    }

    /**
     * This method launches the native document picker and allows the user to select a single
     * or multiple files.
     *
     * @param call
     */
    @PluginMethod
    public void launchPicker(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");

        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);

        startActivityForResult(call, intent, "pickFilesResult");
    }

    @PluginMethod
    public void launchPickerFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);

        startActivityForResult(call, intent, "pickFoldersResult");
    }

    @ActivityCallback
    private void pickFilesResult(PluginCall call, ActivityResult result) {
        JSObject ret = new JSObject();

        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.reject("Activity canceled");
        } else {
            Intent data = result.getData();
            JSArray files = new JSArray();

            if (data.getData() == null) {
                ClipData clip = data.getClipData();

                for (int i=0;i < clip.getItemCount();i++) {
                    Uri uri = clip.getItemAt(i).getUri();

                    getContext().getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

                    JSObject fileInfo = new JSObject();

                    fileInfo.put("filepath", uri.toString());
                    fileInfo.put("filename", this.getFileName(uri));

                    files.put(fileInfo);
                }
            }else{
                Uri uri = data != null ? data.getData() : null;
                getContext().getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

                JSObject fileInfo = new JSObject();

                fileInfo.put("filepath", uri.toString());
                fileInfo.put("filename", this.getFileName(uri));

                files.put(fileInfo);
            }

            ret.put("files", files);
            call.resolve(ret);
        }
    }

    @ActivityCallback
    private void pickFoldersResult(PluginCall call, ActivityResult result) {
        JSObject ret = new JSObject();

        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.reject("Activity canceled");
        } else {
            Intent data = result.getData();
            Uri directory = data.getData();

            JSArray folders = new JSArray();
            folders.put(directory.toString());

            ret.put("folders", folders);
            call.resolve(ret);
        }
    }

    public String getFileName(Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getActivity().getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    @PluginMethod
    public void createFile(PluginCall call) {
        Uri directory = Uri.parse(call.getString("directory"));

        String docId = DocumentsContract.getTreeDocumentId(directory);

        Uri dirUri = DocumentsContract.buildDocumentUriUsingTree(directory, docId);

        Uri outputUri = null;

        try
        {
            outputUri = DocumentsContract.createDocument(
                getContext().getContentResolver(),
                dirUri,
                "*/*",
                call.getString("filename")
            );

            JSObject response = new JSObject();

            response.put("filepath", outputUri.toString());
            response.put("filename", this.getFileName(outputUri));

            call.resolve(response);
        } catch (FileNotFoundException e )
        {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void writeToFile(PluginCall call){
        try {
            OutputStream os = null;

            os = getContext().getContentResolver().openOutputStream( Uri.parse(call.getString("filepath")), "w");

            os.write(call.getString("content").getBytes());

            os.close();

            JSObject response = new JSObject();

            call.resolve(response);
        } catch (FileNotFoundException e) {
            call.reject(e.getMessage());
        } catch (IOException e){
            call.reject(e.getMessage());
        } catch (Exception e){
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void readFile(PluginCall call){
        try {
            InputStreamReader inputStreamReader = new InputStreamReader(
                getContext().getContentResolver().openInputStream(
                    Uri.parse(
                        call.getString("filepath")
                    )
                )
            );

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            StringBuilder sb = new StringBuilder();
            String s;

            while ((s = bufferedReader.readLine()) != null) {
                sb.append(s);
            }

            String fileContent = sb.toString();

            JSObject response = new JSObject();

            response.put("data", fileContent);

            call.resolve(response);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e){
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void fileStat(PluginCall call){
        Uri filepath = Uri.parse(call.getString("filepath"));

        Cursor returnCursor = getContext().getContentResolver().query(filepath, null, null, null, null);

        int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
        int sizeIndex = returnCursor.getColumnIndex(OpenableColumns.SIZE);
        returnCursor.moveToFirst();

        JSObject response = new JSObject();

        response.put("mimeType", getContext().getContentResolver().getType(filepath));
        response.put("fileName", returnCursor.getString(nameIndex));
        response.put("fileSize", returnCursor.getLong(sizeIndex));

        call.resolve(response);
    }

    @PluginMethod
    public void deleteFile(PluginCall call){
        try{
            Uri filepath = Uri.parse(call.getString("filepath"));

            DocumentsContract.deleteDocument(getContext().getContentResolver(), filepath);

            call.resolve();
        }catch(Exception ex){
            call.reject(ex.getMessage());
        }
    }

    @PluginMethod
    public void renameFile(PluginCall call){
        try{
            Uri filepath = Uri.parse(call.getString("filepath"));

            DocumentsContract.renameDocument(getContext().getContentResolver(), filepath, call.getString("newFilename"));

            call.resolve();
        }catch(Exception ex){
            call.reject(ex.getMessage());
        }
    }
}
