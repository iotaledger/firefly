# Workaround for Windows 10, Git Bash and Yarn
# See https://typicode.github.io/husky/#/?id=yarn-on-windows

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi
