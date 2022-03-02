package org.iota.plugins.securefilesystemaccess;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;

import androidx.annotation.RequiresApi;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Mediastore {

    @RequiresApi(api = Build.VERSION_CODES.Q)
    public String saveToDownloads(Context context, String filename, String path) throws Exception {
        Path filePath = Paths.get(path);
        if (filename == null) {
            filename = filePath.getFileName().toString();
        }
        Long size = Files.size(filePath);
        String mimeType = Files.probeContentType(filePath);

        ContentResolver resolver = context.getContentResolver();
        ContentValues contentValues = new ContentValues();
        contentValues.put(MediaStore.Downloads.DISPLAY_NAME, filename);
        contentValues.put(MediaStore.Downloads.MIME_TYPE, mimeType);
        contentValues.put(MediaStore.Downloads.SIZE, size);
        Uri targetUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues);

        copyFile(resolver, path, targetUri);

        return targetUri.toString();
    }

    private void copyFile(ContentResolver resolver, String inputPath, Uri outputUri) throws Exception {
        FileInputStream input;
        try {
            ParcelFileDescriptor sourceFD = resolver.openFileDescriptor(Uri.fromFile(new File(inputPath)), "r", null);
            input = new FileInputStream(sourceFD.getFileDescriptor());
        } catch (Exception e) {
            resolver.delete(outputUri, null, null);
            throw new Exception("Unable to read file from path " + inputPath + " - " + e.getMessage());
        }

        try {
            ParcelFileDescriptor targetFD = resolver.openFileDescriptor(outputUri, "w", null);
            FileOutputStream output = new FileOutputStream(targetFD.getFileDescriptor());

            byte[] buffer = new byte[1024];
            int len;
            while ((len = input.read(buffer)) > 0) {
                output.write(buffer, 0, len);
            }
            output.flush();
            input.close();
            output.close();
        } catch (Exception e) {
            resolver.delete(outputUri, null, null);
            throw  new Exception("Unable to write file - " + e.getMessage());
        }
    }
}
