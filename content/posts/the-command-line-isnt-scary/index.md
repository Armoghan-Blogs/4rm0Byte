---
title: "The Command Line Isn't Scary"
date: "2026-09-30"
summary: "The Command Line Isn't Scary: A Beginner's Terminal Survival Guide"
description: "A beginner's terminal survival guide for security learners: shells, paths, files, pipes, permissions and safe habits, plus a hands-on log-reading exercise."
featureimage: "featured.png"
showSummary: true
showTableOfContents: true
showWordCount: true
showComments: true
showNewsletter: true
showDate: true
showTaxonomies: false
showViews: true
showLikes: true
showBreadcrumbs: true
showEdit: true
showRelatedContent: true
showDateOnlyInArticle: false
replyByEmail: false
showDateUpdated: false
showHeadingAnchors: true
showPagination: true
showReadingTime: true
showReadingProgress: true
tags: ["cybersecurity", "infosec", "beginners", "security-basics", "linux", "command-line", "terminal", "bash", "powershell"]
categories: ["Cybersecurity", "Fundamentals"]
keywords: ["command line for beginners", "terminal survival guide", "linux commands for cybersecurity", "bash basics", "how to read a command", "grep and pipes explained", "linux file permissions explained", "command line for hackers", "PowerShell vs bash", "beginner terminal exercises"]
series: ["Cybersecurity Foundations"]
series_order: 3
author: "Armoghan-ul-Mohmin"
showAuthorBottom: true
draft: false
showZenMode: true
---

{{< lead >}}
The terminal looks like the place where one wrong keystroke ruins your day. In practice it is the most honest interface a computer has: you say exactly what you want, it does exactly that, and it tells you what happened.
{{< /lead >}}

## The short version

A terminal is a text window. Inside it, a program called a shell reads what you type and runs other programs on your behalf. Every command you will ever meet follows the same shape: a program, some options, and something for it to act on.

{{< alert icon="scale-balanced" >}}
**The one idea that carries this article:** a command is a sentence. It has a verb, modifiers, and an object. Once you can read that structure, you can read almost any command you have never seen before, and reading commands is most of what security work asks of you.
{{< /alert >}}

Everything below is a direct consequence of that.

## Why security people live here

A graphical interface shows you what its designer decided you should see. The terminal shows you what is actually there. That difference matters in security work for very practical reasons:

- Most security tools are built terminal-first: Nmap, curl, ssh, tcpdump, and nearly everything on a penetration tester's machine
- Servers, cloud instances, and routers usually have no screen and no mouse
- Logs are text, and searching text is what the terminal is best at
- Anything you type can be repeated, scripted, and shared, which a series of clicks cannot
- Incident reports and attack write-ups quote commands, and you need to read them accurately

Nobody expects you to memorise hundreds of commands. You need a small core and the habit of looking up the rest.

## Terminal, shell, and command

Three words get used as if they mean the same thing. They do not.

{{< mermaid >}}
graph TD
  you["You type a command"]
  terminal["Terminal: the window that shows text"]
  shell["Shell: reads and interprets what you typed"]
  program["Program: does the actual work"]
  output["Output returns to the terminal"]
  you --> terminal
  terminal --> shell
  shell --> program
  program --> output
{{< /mermaid >}}

| Term | What it is | Examples |
| --- | --- | --- |
| Terminal | The window itself | GNOME Terminal, iTerm2, Windows Terminal |
| Shell | The program that interprets your input | bash, zsh, PowerShell |
| Command | A program or built-in the shell runs | `ls`, `grep`, `curl`, `nmap` |

Swapping the terminal changes how it looks. Swapping the shell changes what you can type.

{{< tabs default="Linux" group="os" >}}
  {{< tab label="Linux" icon="code" >}}
  You already have everything. Open the terminal application from your
  menu, or press `Ctrl+Alt+T` on many desktops. The default shell is
  usually bash.
  {{< /tab >}}
  {{< tab label="macOS" icon="shield" >}}
  Open **Terminal** from Applications, then Utilities. The default shell
  is zsh, which behaves almost identically to bash for everything in this
  article.
  {{< /tab >}}
  {{< tab label="Windows" icon="cloud" >}}
  Install **WSL** (Windows Subsystem for Linux) and use a real Linux
  shell inside Windows. Most security tooling and most tutorials assume
  it. PowerShell is worth learning later, but it is a different language
  with different conventions, and mixing the two is a common source of
  confusion.
  {{< /tab >}}
{{< /tabs >}}

## Anatomy of a command

Here is a complete command:

```bash
ls -l /var/log
```

Read it as a sentence: **list** the contents, in **long** format, of the **log directory**.

{{< accordion mode="open" >}}
  {{< accordionItem title="The command" icon="code" open=true >}}
  `ls` is the program to run. It is always the first word.
  {{< /accordionItem >}}
  {{< accordionItem title="Options (also called flags)" icon="wand-magic-sparkles" >}}
  `-l` changes how the command behaves. Short options use one dash and
  one letter, and can be combined: `-la` means `-l` and `-a` together.
  Long options use two dashes and a word, such as `--all`.
  {{< /accordionItem >}}
  {{< accordionItem title="Arguments" icon="list-check" >}}
  `/var/log` is what the command acts on. Without one, many commands
  fall back to a sensible default, such as the current directory.
  {{< /accordionItem >}}
{{< /accordion >}}

{{< figure
    src="shot-01-ls-l.png"
    alt="Terminal output of ls -l /var/log, showing ten-character permission strings like -rw-r----- beside file sizes, owners and groups"
    caption="`ls -l /var/log` in practice. Each permission string reads as type, then owner, group, and everyone else."
>}}

You will never remember every option, and you do not need to. Ask the machine:

```bash
ls --help        # a short summary of options
man ls           # the full manual page (press q to quit)
```

{{< figure
    src="shot-11-man.png"
    alt="A terminal showing the ls manual page, with the NAME, SYNOPSIS and DESCRIPTION sections"
    caption="`man ls` opens the full manual page. Read the `SYNOPSIS` block first, then press `/` to search for the option you want and `q` to quit."
>}}

Reading a man page is a skill in itself. Look at the synopsis at the top, then search for the option you care about by pressing `/` and typing it.

## Finding your way around

The filesystem is a tree. Everything starts at a single root, written `/`, and branches from there.

{{< mermaid >}}
graph TD
  root["/ : root"]
  home["/home : user files"]
  etc["/etc : configuration"]
  var["/var : logs and changing data"]
  tmp["/tmp : temporary files"]
  usr["/usr : installed programs"]
  alice["/home/alice : your home directory"]
  root --> home
  root --> etc
  root --> var
  root --> tmp
  root --> usr
  home --> alice
{{< /mermaid >}}

Four commands cover navigation:

```bash
pwd              # print working directory: where am I?
ls               # what is in here?
cd /var/log      # move to an absolute path
cd ..            # go up one level
```

{{< figure
    src="shot-02-navigation.png"
    alt="Terminal showing pwd, ls, and repeated cd commands with the working directory changing from /home/alice to /var/log to /var and back"
    caption="Moving around. `pwd` tells you where you are, and `cd` changes it. The prompt updates as you go, so the path after `$` is your current location."
>}}

Two ideas make paths click:

- An **absolute path** starts at the root: `/home/alice/notes.txt`. It means the same thing wherever you are
- A **relative path** starts from where you currently are: `notes.txt` or `../other/notes.txt`

A few shortcuts appear constantly: `.` is the current directory, `..` is the parent, and `~` is your home directory.

If you use PowerShell, many of these have aliases, but the flags differ from bash:

| Task | Linux and macOS | PowerShell |
| --- | --- | --- |
| Where am I | `pwd` | `Get-Location` (alias `pwd`) |
| List files | `ls -l` | `Get-ChildItem` (alias `ls`, `dir`) |
| Change directory | `cd` | `Set-Location` (alias `cd`) |
| Show a file | `cat file` | `Get-Content` (alias `cat`) |
| Copy | `cp` | `Copy-Item` (alias `cp`) |
| Move or rename | `mv` | `Move-Item` (alias `mv`) |
| Delete | `rm` | `Remove-Item` (alias `rm`) |
| Search text | `grep` | `Select-String` |
| Who am I | `whoami` | `whoami` |

## Working with files

```bash
mkdir notes            # make a directory
touch todo.txt         # create an empty file (or update its timestamp)
cp todo.txt backup.txt # copy
mv backup.txt old.txt  # move or rename
cat todo.txt           # print a file
less /var/log/syslog   # page through a long file (q to quit)
head -n 5 todo.txt     # first five lines
tail -n 5 todo.txt     # last five lines
```

{{< figure
    src="shot-03-files.png"
    alt="Terminal showing mkdir, touch, cp, mv and ls run in sequence, ending with ls listing old.txt and todo.txt"
    caption="Creating, copying and renaming files. Run `ls` after each step to confirm what actually changed."
>}}

Then there is the one that deserves respect.

{{< alert icon="triangle-exclamation" >}}
`rm` deletes permanently. There is no recycle bin, no confirmation, and no undo. Before deleting with a wildcard, run `ls` with the exact same pattern first and check the list. Never paste an `rm -rf` command you do not fully understand, and be especially wary of ones containing variables or paths you did not type yourself.
{{< /alert >}}

## Reading and searching text

Most security work is reading text: logs, configuration files, scan output, and source code. Three tools do most of the job.

- `grep` prints lines that match a pattern
- `wc -l` counts lines
- `tail -f` follows a file as new lines are added, which is how you watch a log live

```bash
grep "Failed password" /var/log/auth.log     # every failed SSH login
grep -i "error" app.log                       # case-insensitive
grep -c "Failed password" /var/log/auth.log   # just the count
```

{{< figure
    src="shot-04-grep.png"
    alt="Terminal showing grep for Failed password against auth.log, printing four matching sshd lines, followed by grep -c returning 4"
    caption="Grep against a real log file. The four matches are failed SSH logins; `-c` reports the count without printing the lines."
>}}

On many modern distributions the authentication log lives in the systemd journal instead, so the equivalent is `journalctl -u ssh`. Reading it may need `sudo`, which we come to shortly.

### Pipes turn small tools into big ones

The pipe, `|`, sends the output of one command into the input of the next. Each tool does one small job, and you chain them.

```bash
grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
```

{{< figure
    src="shot-05-pipeline.png"
    alt="Terminal running a five-stage pipeline of grep, awk, sort, uniq -c and sort -rn, returning a count of 3 for 203.0.113.5 and 1 for 192.0.2.44"
    caption="The finished pipeline. Five tools, one answer: which address is failing the most?"
>}}

That looks dense, but it is five small steps:

{{< timeline >}}
  {{< timelineItem
    icon="search"
    header="Filter"
    badge="grep"
    subheader="Keep the relevant lines"
    md=true
  >}}
  Keep only lines containing `Failed password`.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="code"
    header="Extract"
    badge="awk"
    subheader="Pick one field"
    md=true
  >}}
  Print the fourth field from the end of each line, which in SSH logs is
  the source IP address.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="list-check"
    header="Group"
    badge="sort"
    subheader="Bring duplicates together"
    md=true
  >}}
  Sort the addresses so identical ones sit next to each other.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="check"
    header="Count"
    badge="uniq -c"
    subheader="Collapse and count"
    md=true
  >}}
  Merge adjacent duplicates and prefix each with how many there were.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="eye"
    header="Rank"
    badge="sort -rn"
    subheader="Biggest first"
    md=true
  >}}
  Sort numerically in reverse, so the noisiest address appears on top.
  {{< /timelineItem >}}
{{< /timeline >}}

Redirection sends output somewhere other than the screen: `>` writes to a file (replacing it), `>>` appends, and `2>` captures error messages separately.

{{< alert icon="lightbulb" >}}
The field position in that `awk` command depends on the log format. Whenever you build a pipeline, run it one stage at a time and look at the output before adding the next `|`. It is the fastest way to find out which stage is wrong.
{{< /alert >}}

{{< figure
    src="shot-06-pipeline-stages.png"
    alt="Terminal running the grep and wc -l pipeline returning 4, then the grep and awk pipeline returning three addresses one per line"
    caption="Building the pipeline one stage at a time. Run the first two stages, confirm the output, then add the next `|`."
>}}

## Permissions

Every file has an owner, a group, and a set of permissions. Run `ls -l` and you will see them:

```text
-rwxr-x--- 1 alice staff 1024 Sep 30 10:00 script.sh
```

Read the first ten characters in groups: the first says what it is (`-` for a file, `d` for a directory, `l` for a link), then three characters each for the **owner**, the **group**, and **everyone else**.

| Symbol | Meaning | Number |
| --- | --- | --- |
| `r` | Read | 4 |
| `w` | Write | 2 |
| `x` | Execute (or enter, for a directory) | 1 |

Add the numbers per group, so `rwx` is 7, `r-x` is 5, and `---` is 0. The file above is therefore `750`.

{{< tabs default="600" group="chmod" >}}
  {{< tab label="600" icon="lock" >}}
  Owner reads and writes, nobody else touches it. The right setting for
  private keys, and SSH will refuse to use a key that is more open than
  this.
  {{< /tab >}}
  {{< tab label="644" icon="file-lines" >}}
  Owner reads and writes, everyone else reads. A normal setting for
  ordinary files.
  {{< /tab >}}
  {{< tab label="755" icon="code" >}}
  Owner has full control, everyone else can read and execute. Typical for
  scripts, programs, and directories.
  {{< /tab >}}
  {{< tab label="777" icon="bomb" >}}
  Everyone can read, change, and execute. If you find yourself typing
  this to make an error go away, stop and work out why the error is
  there. In a review, a world-writable file is a finding.
  {{< /tab >}}
{{< /tabs >}}

Change permissions with `chmod 600 key.pem`. Change ownership with `chown`.

{{< figure
    src="shot-07-permissions.png"
    alt="Terminal showing ls -l in a .ssh directory with a private key at 600, a public key at 644 and a script at 750, plus a note decoding the digits"
    caption="Real permissions in a `.ssh` directory. The private key is `600`, so nothing but its owner can read it, and `ssh` will refuse to use anything more open."
>}}

You will also meet `sudo`, which runs a single command with administrator rights. Treat it as a deliberate act, not a cure for "permission denied". Running everything as root removes the boundary that stops one mistake, or one malicious script, from touching the whole system. That is least privilege from [part one](/posts/what-is-cybersecurity-really/), in a single word.

## Connecting back to the network

In part two we covered how machines talk. The terminal is where you watch that happen:

| From part two | Command | What it shows |
| --- | --- | --- |
| Your addresses | `ip addr` (Linux), `ifconfig` (macOS) | Interfaces and IP addresses |
| Listening ports | `ss -tuln` (Linux), `lsof -i -P -n` (macOS) | What your machine is offering to the network |
| DNS | `dig example.com` | What the name resolves to |
| HTTP | `curl -I https://example.com` | Response headers only |
| Path | `traceroute example.com` | The routers between you and a target |
| Processes | `ps aux`, `top` | What is running and who owns it |

Run `ss -tuln` on your own machine and look at the list. Every line is a service someone could connect to, and you should be able to explain each one.

{{< figure
    src="shot-08-network.png"
    alt="Terminal showing ss -tuln with listening sockets on ports 22, 631, 8080, 5432 and 9100, and a note that 0.0.0.0 means every interface"
    caption="`ss -tuln` on a web server. Ports 22, 8080, 5432 and 9100 are all reachable from the network, and each one should be a decision you can explain."
>}}

## Shortcuts that make it bearable

Nobody types everything out. These save the most time:

| Shortcut | What it does |
| --- | --- |
| `Tab` | Completes file names and commands. Press twice to list the options |
| `Up arrow` | Recalls the previous command |
| `Ctrl+R` | Searches your command history as you type |
| `Ctrl+C` | Stops the running command |
| `Ctrl+L` | Clears the screen |
| `Ctrl+A` and `Ctrl+E` | Jump to the start and end of the line |
| `history` | Lists what you have run before |

Tab completion is the important one. It saves typing and also catches mistakes, because if Tab will not complete a name, the name probably does not exist.

## Running commands you did not write

Copy-pasting is how most people meet the terminal, and it is also a genuine attack route. A command you paste runs with your privileges, exactly as written.

The classic example is the "one-line installer":

```bash
curl -fsSL https://example.com/install.sh | bash
```

That downloads a script and runs it immediately, sight unseen. The safer version takes three steps:

```bash
curl -fsSLO https://example.com/install.sh   # download only
less install.sh                               # read it
bash install.sh                               # run it once you are satisfied
```

{{< figure
    src="shot-09-curl-pipe-bash.png"
    alt="Terminal contrasting the one-line curl piped to bash installer against the safer three-step download, read, then run sequence"
    caption="The same install, two ways. Only one of them gives you a chance to see what you are about to run."
>}}

> [!IMPORTANT]
> Before you run anything you did not write, read it. If you cannot follow what it does, paste it into [explainshell](https://explainshell.com/) or look up each part with `man`, and try it in a virtual machine first. "It was in a tutorial" and "it was in a GitHub issue" are both how people get compromised.

## Try it: a 15-minute exercise

This exercise uses a small fake SSH log so you can practise safely. Everything happens in a new directory, and the addresses come from ranges reserved for documentation, so they point at nothing real. Windows users should run it in WSL.

```bash
mkdir -p ~/terminal-practice && cd ~/terminal-practice

cat > auth.log << 'EOF'
Sep 30 10:01:12 host sshd[811]: Failed password for root from 203.0.113.5 port 51234 ssh2
Sep 30 10:01:15 host sshd[811]: Failed password for invalid user admin from 203.0.113.5 port 51236 ssh2
Sep 30 10:02:40 host sshd[822]: Accepted password for alice from 198.51.100.7 port 40022 ssh2
Sep 30 10:03:02 host sshd[831]: Failed password for root from 192.0.2.44 port 60110 ssh2
Sep 30 10:03:05 host sshd[831]: Failed password for root from 203.0.113.5 port 51240 ssh2
EOF
```

Now work through it one stage at a time:

```bash
cat auth.log                                   # look at the raw data
grep "Failed password" auth.log                # only failures
grep "Failed password" auth.log | wc -l        # how many
grep "Failed password" auth.log | awk '{print $(NF-3)}'
grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
```

The last command should print:

```text
      3 203.0.113.5
      1 192.0.2.44
```

{{< figure
    src="shot-10-brute-force.png"
    alt="Terminal showing the ranked pipeline output, then a grep for Accepted revealing a successful login for alice from 198.51.100.7"
    caption="The full exercise result. Three failures from one address, then the one line that says who got in."
>}}

One address failing three times within four minutes, against `root` and `admin`, is what a brute-force attempt looks like in a log. You have just done log analysis. From there, try `grep "Accepted"` to see who got in, and ask yourself which line would worry you more.

## Where to go from here

The goal is not memorisation. It is to reach the point where a terminal window feels ordinary.

- Practise daily. Use the terminal for things you would normally click, such as moving files and checking your IP address
- Learn one text editor well enough to save and quit: `nano` is the gentle option
- Write a five-line shell script that automates something you keep doing
- Learn `ssh` and connect to a virtual machine you control
- Play the [Bandit wargame](https://overthewire.org/wargames/bandit/), which teaches exactly this material through small puzzles

Once the basics are comfortable, the [tutorials](/tutorials/) are the place to practise them and the [cheatsheets](/cheatsheet/) are the place to look things up. If you want to see the terminal used in anger, the [writeups](/writeups/) section walks through real problems, and [tools](/tools/) covers the software you will reach for. When you want the skills to bite back, the [terminal range](/terminal/) puts them to work on scripted SOC, forensics, and threat-hunting cases.

{{< alert icon="graduation-cap" >}}
This is the third entry in the **Cybersecurity Foundations** series. [What Is Cybersecurity, Really?](/posts/what-is-cybersecurity-really/) covered the language of risk, [How Computer Talk](/posts/how-computer-talk/) the wire that risk travels over, and this part the interface you will use to inspect both.
{{< /alert >}}

Spotted a mistake or something unclear? The [contact page](/contact/) is the fastest way to reach me.

## References

- [The GNU Bash Reference Manual][bash-manual]
- [Linux man pages online][man7]
- [POSIX.1-2017: Shell and Utilities][posix]
- [Microsoft Learn: Install WSL][wsl]
- [Microsoft Learn: PowerShell documentation][powershell]
- [explainshell: match command-line arguments to their help text][explainshell]
- [OverTheWire: Bandit][bandit]
- [Linux Journey][linuxjourney]
- [Wikipedia: Command-line interface][wp-cli]
- [Wikipedia: Unix shell][wp-shell]

[bash-manual]: https://www.gnu.org/software/bash/manual/bash.html
[man7]: https://man7.org/linux/man-pages/
[posix]: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/contents.html
[wsl]: https://learn.microsoft.com/en-us/windows/wsl/install
[powershell]: https://learn.microsoft.com/en-us/powershell/
[explainshell]: https://explainshell.com/
[bandit]: https://overthewire.org/wargames/bandit/
[linuxjourney]: https://linuxjourney.com/
[wp-cli]: https://en.wikipedia.org/wiki/Command-line_interface
[wp-shell]: https://en.wikipedia.org/wiki/Unix_shell
