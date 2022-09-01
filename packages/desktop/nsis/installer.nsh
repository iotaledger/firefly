!addincludedir build

!addplugindir /x86-unicode "build\x86-unicode"
!addplugindir /x86-ansi "build\x86-ansi"

!macro customInstall

    DetailPrint "VC++ Redistributable package is missing!"
    inetc::get "https://aka.ms/vs/17/release/vc_redist.x64.exe" $PLUGINSDIR\vcredist.exe
    DetailPrint "Installing Visual Studio Redistributable package..."
    ExecWait '"$PLUGINSDIR\vcredist.exe" /q /norestart'
    DetailPrint "Done"
!macroend
