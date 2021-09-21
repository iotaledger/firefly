# Workaround for Windows 10, Git Bash and Yarn
# See https://typicode.github.io/husky/#/?id=yarn-on-windows

command_exists () {
  ## ">/dev/null" redirects stdout to /dev/null, which discards it
  ## "2>&1" redirects stderr (2) to stdout (1), which was redirected to an empty void
  command -v "$1" >/dev/null 2>&1
}

if command_exists winpty && test -t 1; then
  ## execute /dev/tty, which represents the terminal for the current process
  exec < /dev/tty
fi
