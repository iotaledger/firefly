!include LogicLib.nsh

!macro customInstall
    SetRegView 64
    ReadRegStr $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\X64" "Version"
    MessageBox MB_OK "version: $0"
    SetRegView 32
    
    ${If} $0 == ''
        DetailPrint "VC++ Redistributable package is missing!"
        inetc::get "https://aka.ms/vs/17/release/vc_redist.x64.exe" $PLUGINSDIR\vcredist.exe
        DetailPrint "Installing Visual Studio Redistributable package..."
        ExecWait '"$PLUGINSDIR\vcredist.exe" /q /norestart'
        DetailPrint "Done"
    ${Else}
        DetailPrint "VC++ Redistributable already installed"
    ${EndIf}
!macroend
