!macro customInstall
    SetRegView 64
    ReadRegStr $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\X64" "Version"
    SetRegView 32

    StrCmp $0 '' notInstalled installed

    notInstalled:
    DetailPrint "VC++ Redistributable package is missing!"
    NScurl::http GET "https://aka.ms/vs/17/release/vc_redist.x64.exe" $PLUGINSDIR\vcredist.exe /DOH "https://cloudflare-dns.com/dns-query" /CANCEL /RESUME /END
    Pop $0
    DetailPrint "Installing Visual Studio Redistributable package..."
    ExecWait '"$PLUGINSDIR\vcredist.exe" /q /norestart'
    DetailPrint "Done"

    installed:
    DetailPrint "VC++ Redistributable installed"
!macroend
