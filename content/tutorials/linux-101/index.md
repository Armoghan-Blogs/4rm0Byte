---
title: "Linux 101"
date: "2026-10-02"
summary: "Linux 101: Setting Up Your First Security Lab"
description: "Build a safe, isolated security lab with VirtualBox, Kali Linux and Ubuntu Server, then prove it works with ping, Nmap, curl, SSH and tcpdump."
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
tags: ["cybersecurity", "infosec", "beginners", "linux", "kali-linux", "ubuntu", "virtualbox", "home-lab", "nmap", "networking", "vmware", "hyper-v", "virtualization"]
categories: ["Cybersecurity", "Fundamentals"]
keywords: ["security lab setup", "home lab for beginners", "kali linux virtual machine", "virtualbox kali linux", "ubuntu server virtual machine", "ethical hacking lab", "linux for beginners", "isolated lab network", "host-only network virtualbox", "nmap first scan", "cybersecurity home lab", "virtualbox host-only vs nat", "hyper-v security lab"]
series: ["Cybersecurity Foundations"]
series_order: 4
author: "Armoghan-ul-Mohmin"
showAuthorBottom: true
draft: false
showZenMode: false
---

{{< lead >}}
A security lab is a place where you can break things on purpose without breaking anything that matters. This guide builds one on your own computer in about ninety minutes: an attacker machine, a target, and a private network between them.
{{< /lead >}}


## What you will build

Two virtual machines on one private network, both running on your existing computer:

{{< mermaid >}}
graph TD
  host["Your computer (host)"]
  net["Host-only network: 192.168.56.0/24"]
  kali["Kali Linux VM: the attacker"]
  ubuntu["Ubuntu Server VM: the target"]
  internet["Internet, through NAT"]
  host --- net
  kali --- net
  ubuntu --- net
  kali -.->|"NAT, for updates"| internet
  ubuntu -.->|"NAT, for updates"| internet
{{< /mermaid >}}

The two machines have separate jobs, and the difference matters later:

| Machine | System | Role | RAM | Disk |
| --- | --- | --- | --- | --- |
| `attacker` | [Kali Linux][wp-kali] | Where you run tools | 4 GB (2 GB at a push) | About 25 GB |
| `target` | [Ubuntu Server][wp-ubuntu-server] 26.04 LTS | Something to look at, scan, and defend | 2 GB | 20 GB |

The target runs a normal, updated Ubuntu with [SSH][wp-ssh] and [Apache HTTP Server][wp-apache]. It is not deliberately vulnerable. That is on purpose: you learn what a healthy machine looks like before you go looking for sick ones.

{{< alert icon="scale-balanced" >}}
**The one rule of the lab:** nothing vulnerable ever touches your real network. Every machine you add later gets the isolated network only, never bridged networking, and never your home Wi-Fi.
{{< /alert >}}

## What you need

| Requirement | Minimum | Comfortable |
| --- | --- | --- |
| Host RAM | 8 GB | 16 GB |
| Free disk space | 60 GB | 100 GB |
| CPU | 64-bit with virtualisation support | 4 or more cores |
| Internet | For downloads and updates | Anything faster than patience |

Two machines running at once is where host RAM usually runs out first. Kali at 4 GB and Ubuntu Server at 2 GB is the comfortable split; drop Kali to 2 GB if you have to, and keep the target on 2.

[Virtualization][wp-virtualization] must be switched on, and it is sometimes off by default. Check yours:

{{< tabs default="Windows" group="host" >}}
  {{< tab label="Windows" icon="code" >}}
  Open Task Manager, go to **Performance**, then **CPU**. The line
  **Virtualization** should say **Enabled**. If it says Disabled, turn on
  Intel VT-x or AMD SVM in your UEFI settings.
  {{< /tab >}}
  {{< tab label="Linux" icon="shield" >}}
  Run `lscpu | grep -i virtualization`. Any output mentioning VT-x or AMD-V
  means the CPU supports it. If VirtualBox later complains, enable it in
  UEFI.
  {{< /tab >}}
  {{< tab label="macOS" icon="cloud" >}}
  Intel Macs support it out of the box. Apple Silicon Macs also work, but
  they can only run **ARM** guests, so you must download the ARM64 builds of
  Kali and Ubuntu in step 3.
  {{< /tab >}}
{{< /tabs >}}

<br>

{{< alert icon="triangle-exclamation" >}}
On Windows, features such as WSL2 and Hyper-V share the virtualisation hardware with VirtualBox. It usually works, but it can be slower. WSL alone is not a substitute for this lab: you cannot easily give it a second machine on an isolated network, and that second machine is the whole point.
{{< /alert >}}

<br>

{{< alert icon="lightbulb" >}}
Versions change quickly. At the time of writing, the current releases are Kali Linux 2026.2, Ubuntu Server 26.04.1 LTS, and the VirtualBox 7.2 series. Kali releases roughly every quarter, so use whatever the official download pages list when you read this. The steps do not depend on the exact version number.
{{< /alert >}}

## Which hypervisor to use

A [hypervisor][wp-hypervisor] is the software that runs the virtual machines. VirtualBox is what the rest of this guide walks through, because it runs on all three host operating systems and its networking model is the one worth understanding. [VMware Workstation][vmware-workstation] and [Hyper-V][hyperv] do the same job with different words for it. Every Linux command from here on is identical regardless of which one you picked.

| Hypervisor | Runs on | Lab network equivalent |
| --- | --- | --- |
| [VirtualBox][vbox-downloads] | Windows, Linux, macOS | NAT + Host-only Adapter |
| [VMware Workstation][vmware-workstation] | Windows, Linux | NAT + Host-only |
| [Hyper-V][hyperv] | Windows Pro and above | NAT-capable switch + Internal switch |

Pick one and stay with it. If you already have VMware or Hyper-V installed and working, use that instead of installing a third hypervisor.

{{< alert icon="circle-info" >}}
The design is identical in all three: **one adapter for internet access, a second adapter for the private lab network.** Only the menu names and the default subnet differ. Read the hypervisor-specific note in [Step 2](#step-2-create-the-lab-network) before you start clicking.
{{< /alert >}}

## Step 1: Install VirtualBox

VirtualBox is free and runs on Windows, Linux, and macOS. Download it from [virtualbox.org][vbox-downloads], run the installer, and accept the defaults. You do not need the Extension Pack for this lab.

Menu names move around slightly between VirtualBox versions. If a menu item below is not where I say, look one level up or down.

## Step 2: Create the lab network

Each VM will get two network adapters:

- **Adapter 1: NAT.** [Network address translation][wp-nat] gives the VM internet access for updates, while hiding it from the outside world
- **Adapter 2: Host-only.** A private network shared by your VMs and your computer, and by nothing else
Host-only is what keeps the lab isolated. Packets on that network cannot reach your router or the internet.

In VirtualBox, open **Tools** and then **Network** (some versions call it Network Manager) and look under **Host-only Networks**. If none exists, create one and make sure its DHCP server is **enabled**. The default `192.168.56.0/24` range is fine. From part two, that is a /24: 256 addresses, 254 usable.

{{< tabs default="VirtualBox" group="hypervisor" >}}
  {{< tab label="VirtualBox" icon="code" >}}
  **Tools → Network → Host-only Networks**, create one if the list is
  empty, and leave **DHCP server** enabled. Note the address range.
  {{< /tab >}}
  {{< tab label="VMware" icon="shield" >}}
  **Edit → Virtual Network Editor**. Look for the host-only network, which
  is `VMnet1` on most installations. Confirm it exists; create one if it does
  not. `VMnet8` is the NAT network. These are common defaults, not rules, so
  check rather than assume.
  {{< /tab >}}
  {{< tab label="Hyper-V" icon="cloud" >}}
  **Hyper-V Manager → Virtual Switch Manager**, and create a switch of type
  **Internal** named `SecurityLab`. Internal connects your VMs to each other
  and to the host, with no route to your physical network. Use the
  **Default Switch** for internet access.
  {{< /tab >}}
{{< /tabs >}}

<br>

{{< alert icon="triangle-exclamation" >}}
Bridged networking puts the VM directly on your physical network. Never select it for the lab adapter, on any hypervisor. That single click is the difference between a lab and an incident.
{{< /alert >}}

## Step 3: Download and verify the images

Download both images from the official sources:

- **Kali Linux:** the pre-built VirtualBox image from [kali.org/get-kali][kali-get] (choose "Virtual Machines"). Kali publishes VMware and Hyper-V builds on the same page
- **Ubuntu Server:** the installer ISO from [ubuntu.com/download/server][ubuntu-server]
On Apple Silicon, pick the ARM64 builds of both.

{{< alert icon="shield" >}}
Download from the official project sites only. Third-party VM images are a well-known way to get a machine that is already compromised before you have even logged in.
{{< /alert >}}

Then verify them, because a lab built on a tampered image teaches you nothing good. Both projects publish [SHA-2][wp-sha2] checksums next to their downloads. Compute the hash of your file and compare it:

{{< tabs default="Linux" group="hash" >}}
  {{< tab label="Linux" icon="code" >}}
  `sha256sum filename`
  {{< /tab >}}
  {{< tab label="macOS" icon="code" >}}
  `shasum -a 256 filename`
  {{< /tab >}}
  {{< tab label="Windows" icon="code" >}}
  In PowerShell: `Get-FileHash .\filename -Algorithm SHA256`
  {{< /tab >}}
{{< /tabs >}}

The strings must match exactly. If they do not, delete the file and download it again.

> [!NOTE]
> A matching checksum shows the file arrived intact. It does not prove the checksum itself is genuine, which is why Kali also publishes signed checksum files. The [official Kali download guide][kali-verify] explains how to check the signature. Do this once, so you know how, even if you skip it later.

## Step 4: Build the attacker

The pre-built Kali image saves you an installation.

1. Extract the downloaded archive. It is a `.7z` file, so use 7-Zip on Windows or `7z x filename` on Linux and macOS
2. In VirtualBox choose **Machine**, then **Add**, and select the `.vbox` file from the extracted folder
3. Open the VM's **Settings**, then **System**, and give it 4096 MB of RAM and 2 CPUs
4. Under **Network**, leave Adapter 1 as NAT. Enable **Adapter 2**, attach it to **Host-only Adapter**, and choose your host-only network
5. Start the VM and log in. The default username and password for Kali's pre-built images are both `kali`
6. **Change the password immediately** by running `passwd`
Then update it:

```bash
sudo apt update && sudo apt full-upgrade -y
```

That default password is public knowledge. Changing it is a habit worth forming now, because a machine with factory credentials is one of the most common ways real systems get compromised.

## Step 5: Build the target

This time you install from scratch, which teaches more.

1. In VirtualBox choose **Machine**, then **New**. Name it `target`, select the Ubuntu ISO, and set the type to Linux, version Ubuntu (64-bit)
2. Tick **Skip Unattended Installation**, so you choose the credentials yourself
3. Give it 2048 MB of RAM, 1 CPU, and a 20 GB disk
4. Before starting, open **Settings**, then **Network**, and set Adapter 1 to NAT and Adapter 2 to your host-only network. Do this **before** installing, so the installer configures both
5. Start the VM and follow the installer. The defaults are fine until the profile screen, where you set the server name to `target` and choose a username and a strong password
6. When asked, **install the OpenSSH server**. Skip the optional snaps
7. When the install finishes, reboot and log in
Now update the system and add a web server, so there is something to find:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apache2
```

Apache starts automatically. Check that both services are listening:

```bash
ss -tuln
```

You should see ports 22 and 80 in the list. That is the same command from the [command line post](/posts/the-command-line-isnt-scary/), now pointed at a machine you built.

{{< figure
    src="shot-02-ss-tuln.png"
    alt="Terminal showing ss -tuln output on the target, listing LISTEN sockets on port 22 for sshd and port 80 for apache2"
    caption="Ports 22 and 80 are listening. `0.0.0.0` means the service listens on every interface, including the private lab network."
>}}

## Linux essentials you just used

You have already used more Linux than it may feel like. Here are the commands worth keeping:

| Task | Command |
| --- | --- |
| Refresh the list of available packages | `sudo apt update` |
| Install updates | `sudo apt upgrade` (or `full-upgrade` on Kali) |
| Install a program | `sudo apt install name` |
| Check on a service | `systemctl status apache2` |
| Start or stop a service | `sudo systemctl start apache2`, `sudo systemctl stop apache2` |
| Read a service's logs | `journalctl -u apache2` |
| Show addresses, briefly | `ip -br addr` |
| Show listening ports | `ss -tuln` |
| Manage the firewall | `sudo ufw status` |

## Step 6: Prove the lab works

### Find the target's address

On the `target`, find its address on the host-only network:

```bash
ip -br addr
```

You will see two interfaces with addresses. The host-only one starts with `192.168.56.`, and the NAT one is usually `10.0.2.15`.

{{< figure
    src="shot-01-ip-br-addr-target.png"
    alt="Terminal showing ip -br addr on the target, with enp0s3 at 10.0.2.15 for NAT and enp0s8 at 192.168.56.102 on the private lab network"
    caption="Two interfaces, two jobs. The 192.168.56.x address is the one that matters — it is the target on the private lab network."
>}}

Interface names differ between installations (`enp0s8`, `eth1`, `ens33`), so read the output rather than expecting a particular name. Now switch to the `attacker` and save that address in a variable so you do not retype it:

{{< figure
    src="shot-03-export-target.png"
    alt="Terminal showing export TARGET=192.168.56.102 followed by echo $TARGET printing the stored address"
    caption="Store the address once. Every command in the rest of the guide uses `$TARGET`, so nothing has to be retyped."
>}}

### Checkpoint 1: ping

Test the connection:

```bash
ping -c 4 $TARGET
```

{{< figure
    src="shot-04-ping.png"
    alt="Terminal showing ping -c 4 output with four replies from 192.168.56.102 and 0% packet loss"
    caption="Replies mean the two machines can talk over the private network. If ping fails, stop here — nothing downstream will work until it passes."
>}}

### Checkpoint 2: nmap

Now look at what the target is offering. Part two said a port scan sends a SYN and classifies the reply, so this is that, in practice, using [Nmap][wp-nmap]:

```bash
nmap -sV $TARGET
```

{{< figure
    src="shot-05-nmap-sv.png"
    alt="Terminal showing nmap -sV output with port 22 open running OpenSSH 10.2p1 and port 80 open running Apache httpd 2.4.66"
    caption="`-sV` asked each open port to identify the software behind it. The versions match what you installed, which is the point: you should always be able to account for every open port."
>}}

Now try it with and without `sudo`. Without it, Nmap completes the full TCP handshake. With it, Nmap sends a SYN and stops after the reply — the half-open scan from part two. The results are the same; the packets on the wire are not.

### Talk to the services

Next, talk to the web server directly, then log in over [SSH][wp-ssh]:

```bash
curl -I http://$TARGET           # response headers only
ssh yourusername@$TARGET         # use the account you created
```

{{< figure
    src="shot-06-curl-headers.png"
    alt="Terminal showing curl -I output with HTTP/1.1 200 OK and a Server: Apache/2.4.66 (Ubuntu) header"
    caption="The `Server` header confirms what Nmap guessed at the port level. Same machine, same fact, a different layer."
>}}

{{< figure
    src="shot-07-ssh.png"
    alt="Terminal showing ssh login to the target, an authenticity fingerprint prompt, then the hostname command returning target, then exit"
    caption="Log in, confirm with `hostname` that you are on `target`, then `exit` to come back."
>}}

The first time you connect over SSH you will be asked whether to trust the server's fingerprint. That prompt is the protection against an impostor answering at that address. In a lab you can accept it. On a real network, you compare the fingerprint first.

{{< alert icon="triangle-exclamation" >}}
Only scan machines you own or have written permission to test. Everything in this lab qualifies. Your neighbour's router, your university network, and the internet at large do not.
{{< /alert >}}

## Step 7: Break it and watch

Now the useful part. Part two described three answers a port can give: open, closed, and filtered. You can produce all three on demand.

**Closed.** On the target, stop the web server, then scan from the attacker:

```bash
# on the target
sudo systemctl stop apache2

# on the attacker
nmap -p 22,80 $TARGET
```

{{< figure
    src="shot-08-nmap-closed.png"
    alt="Terminal showing nmap -p 22,80 output where port 22 is open and port 80 is reported closed after Apache was stopped"
    caption="Port 80 is `closed`. The machine is still there and answering, but nothing is listening — it replied with a reset."
>}}

**Filtered.** Start Apache again, then turn on the firewall with [UFW][wp-ufw], allowing SSH first so you do not lock yourself out:

```bash
# on the target
sudo systemctl start apache2
sudo ufw allow 22/tcp
sudo ufw enable

# on the attacker
nmap -p 22,80 $TARGET
```

{{< figure
    src="shot-09-ufw-filtered.png"
    alt="Terminal showing ufw allow 22/tcp and ufw enable on the target, then nmap from kali reporting port 22 open and port 80 filtered"
    caption="Port 80 is now `filtered`. Apache is running, but the firewall drops the packet silently, so the scanner gets no reply at all."
>}}

From the outside, "nothing there" and "something hidden" look different, and that difference is information. Undo it with `sudo ufw disable` when you are done.

**Watch the handshake.** Open two terminals on the attacker. In the first, capture traffic on the host-only interface with [tcpdump][wp-tcpdump] (check its name with `ip -br addr`; it is probably `eth1`):

```bash
sudo tcpdump -i eth1 -n 'tcp port 80'
```

In the second, make a request:

```bash
curl -s -o /dev/null http://$TARGET
```

{{< figure
    src="shot-10-tcpdump.png"
    alt="Terminal showing tcpdump output with three packets: Flags [S] SYN, Flags [S.] SYN-ACK, and Flags [.] ACK between 192.168.56.101 and 192.168.56.102 on port 80"
    caption="The three-way handshake from part two, captured on a network you built: SYN, SYN-ACK, ACK."
>}}

### Three levels, one machine

You have now seen the same target three ways. Nmap told you a port was open. Curl showed you what the web server said. Tcpdump showed the individual packets underneath both.

{{< mermaid >}}
flowchart LR
  nmap["nmap<br/>service discovery"] --> curl["curl<br/>application-level HTTP"] --> tcpdump["tcpdump<br/>individual packets"]
{{< /mermaid >}}

That progression is the point of the lab. The diagrams in [part two](/posts/how-computer-talk/) are no longer pictures of packets — they are lines in a terminal, on a network you built yourself.

## Step 8: Take a snapshot

Before you experiment further, snapshot both machines. In VirtualBox choose **Machine**, then **Take Snapshot**, and name it something like `clean-lab-v1`. When you break something, and you will, you can roll back in seconds instead of rebuilding.

{{< alert icon="lightbulb" >}}
A snapshot is not a backup. It is a restore point on one disk, on one machine. Keep real backups of anything you cannot rebuild.
{{< /alert >}}

## Habits worth keeping

- **Keep the lab isolated.** Add new machines to the host-only network only. Deliberately vulnerable ones should also have their NAT adapter disabled
- **Update before you experiment**, and snapshot afterwards, so you know what a clean state looks like
- **Change default credentials** on everything, even in a lab. It builds the habit you will need on real systems
- **Write down what you did.** A simple notes file of commands and what they showed becomes your own cheatsheet faster than you expect
- **Read `man nmap`** before you reach for a flag you have not used. The reference is clearer than most blog posts

## Is the lab finished?

Every line below should be something you did, not something you read:

- [ ] Kali boots
- [ ] Ubuntu boots
- [ ] Both VMs have an address on the private lab network
- [ ] Kali can ping Ubuntu
- [ ] Nmap finds SSH on 22
- [ ] Nmap finds HTTP on 80
- [ ] curl reaches Apache
- [ ] SSH connects to Ubuntu
- [ ] Stopping Apache makes port 80 `closed`
- [ ] UFW makes port 80 `filtered`
- [ ] tcpdump captures the three-way handshake
- [ ] Both VMs have a snapshot named `clean-lab-v1`

If every box is ticked, you built a security lab.

## Troubleshooting

{{< accordion mode="collapse" >}}
  {{< accordionItem title="VirtualBox says VT-x or AMD-V is not available" icon="triangle-exclamation" >}}
  Virtualisation is disabled in your UEFI settings. Enable Intel
  Virtualization Technology or AMD SVM there, then restart. On Windows,
  also check whether another hypervisor feature is holding the hardware.
  {{< /accordionItem >}}
  {{< accordionItem title="VMware cannot find the host-only network" icon="link" >}}
  Open **Edit → Virtual Network Editor** and confirm a host-only `VMnet`
  exists. Then attach the second adapter to that network rather than NAT
  or Bridged.
  {{< /accordionItem >}}
  {{< accordionItem title="Hyper-V has no private lab network" icon="link" >}}
  Open **Virtual Switch Manager** and confirm your `SecurityLab` switch
  exists and is set to **Internal**. Then check that both VMs have an
  adapter attached to it.
  {{< /accordionItem >}}
  {{< accordionItem title="The attacker has no address on the host-only adapter" icon="link" >}}
  Check that Adapter 2 is enabled and attached to the right host-only
  network, and that the network's DHCP server is on. Inside the VM, run
  `ip -br link` to see the interface names, then try
  `sudo dhclient eth1`, using your interface name.
  {{< /accordionItem >}}
  {{< accordionItem title="The target has no address on the second adapter" icon="search" >}}
  This happens when the adapter was added after installation. Run
  `ip -br link` to find the interface name (often `enp0s8`), then create
  `/etc/netplan/60-hostonly.yaml` containing a `network:` block with
  `version: 2` and an `ethernets:` entry for that interface with
  `dhcp4: true`. Run `sudo chmod 600` on the file, then
  `sudo netplan apply`.
  {{< /accordionItem >}}
  {{< accordionItem title="Ping works but Nmap shows nothing" icon="eye" >}}
  Check the firewall on the target with `sudo ufw status`. Also confirm
  the services are running with `systemctl status ssh` and
  `systemctl status apache2`. Connectivity and service availability are
  separate things: a host can be perfectly reachable with everything
  else switched off.
  {{< /accordionItem >}}
  {{< accordionItem title="Ping does not work at all" icon="bug" >}}
  Compare the addresses first with `ip -br addr` on both machines. Two
  machines on different subnets cannot reach each other even though
  both are on a lab network. If the ranges differ, check the second
  virtual adapter on each.
  {{< /accordionItem >}}
  {{< accordionItem title="Everything is slow" icon="bug" >}}
  You are probably short of RAM. Close other applications, drop Kali to
  2 GB, and avoid running a desktop environment on the target. Ubuntu
  Server has none by default, which is one reason it makes a good target.
  {{< /accordionItem >}}
  {{< accordionItem title="Nmap finds fewer ports than expected" icon="eye" >}}
  Nmap scans 1000 TCP ports by default, not all 65535. Run
  `nmap -p- $TARGET` for a full scan, and expect it to take noticeably
  longer. On a /24 lab network that is a few minutes at most.
  {{< /accordionItem >}}
{{< /accordion >}}

## Where to go from here

You now have somewhere safe to practise. The next sensible steps, in order:

- Run `nmap` with different options and read each one in `man nmap`
- Harden the target: disable password login for SSH, add a non-default firewall rule set, and rescan to see what changed
- Read the target's logs with `journalctl` while you scan it, and spot your own activity in `/var/log/apache2/`
- Add a third machine to the private network and practise identifying multiple hosts at once
- Add a deliberately vulnerable machine, on the host-only network only, and learn to look for weaknesses
- Move on to the [tutorials](/tutorials/) for guided exercises, and keep the [cheatsheets](/cheatsheet/) open while you work

{{< alert icon="graduation-cap" >}}
This is the fourth entry in the **Cybersecurity Foundations** series. Part one covered the language of risk, [part two](/posts/how-computer-talk/) the wire it travels over, [part three](/posts/the-command-line-isnt-scary/) the command line, and this part gives you the place to practise all three.
{{< /alert >}}

Spotted a mistake, or hit a problem this guide does not cover? The [contact page](/contact/) is the fastest way to reach me.

## References

- [Oracle VirtualBox downloads][vbox-downloads]
- [Oracle VirtualBox User Manual][vbox-manual]
- [Oracle VirtualBox networking documentation][vbox-networking]
- [Kali Linux: get Kali][kali-get]
- [Kali Linux: download and verify official images][kali-verify]
- [Kali Linux release history][kali-releases]
- [VMware Workstation][vmware-workstation]
- [Microsoft Hyper-V][hyperv]
- [Microsoft Hyper-V virtual switches][hyperv-switch]
- [Ubuntu Server download][ubuntu-server]
- [Ubuntu 26.04 LTS release notes][ubuntu-notes]
- [Ubuntu community documentation: UFW][ufw]
- [Nmap Reference Guide: Port Scanning Basics][nmap-basics]
- [OpenSSH manual pages][openssh]
- [Wikimedia: Virtualization][wp-virtualization]
- [Wikimedia: Hypervisor][wp-hypervisor]
- [Wikimedia: Network address translation][wp-nat]
- [Wikimedia: Kali Linux][wp-kali]
- [Wikimedia: Ubuntu Server][wp-ubuntu-server]
- [Wikimedia: SHA-2][wp-sha2]
- [Wikimedia: Nmap][wp-nmap]
- [Wikimedia: Tcpdump][wp-tcpdump]
- [Wikimedia: UFW][wp-ufw]
- [Wikimedia: Secure Shell][wp-ssh]
- [Wikimedia: Apache HTTP Server][wp-apache]
- [Wikimedia: Three-way handshake][wp-handshake]

[vbox-downloads]: https://www.virtualbox.org/wiki/Downloads
[vbox-manual]: https://www.virtualbox.org/manual/
[vbox-networking]: https://www.virtualbox.org/manual/chapter-07.html
[kali-get]: https://www.kali.org/get-kali/
[kali-verify]: https://www.kali.org/docs/introduction/download-official-kali-linux-images/
[kali-releases]: https://www.kali.org/releases/
[vmware-workstation]: https://support.broadcom.com/group/ecx/productdownloads?subfamilies=desktop%20workstation
[hyperv]: https://learn.microsoft.com/windows-server/virtualization/hyper-v/
[hyperv-switch]: https://learn.microsoft.com/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines
[ubuntu-server]: https://ubuntu.com/download/server
[ubuntu-notes]: https://documentation.ubuntu.com/release-notes/26.04/
[ufw]: https://help.ubuntu.com/community/UFW
[nmap-basics]: https://nmap.org/book/man-port-scanning-basics.html
[openssh]: https://www.openssh.com/manual.html
[wp-virtualization]: https://en.wikipedia.org/wiki/Virtualization
[wp-hypervisor]: https://en.wikipedia.org/wiki/Hypervisor
[wp-nat]: https://en.wikipedia.org/wiki/NAT
[wp-kali]: https://en.wikipedia.org/wiki/Kali_Linux
[wp-ubuntu-server]: https://en.wikipedia.org/wiki/Ubuntu_Server
[wp-sha2]: https://en.wikipedia.org/wiki/SHA-2
[wp-nmap]: https://en.wikipedia.org/wiki/Nmap
[wp-tcpdump]: https://en.wikipedia.org/wiki/Tcpdump
[wp-ufw]: https://en.wikipedia.org/wiki/UFW
[wp-ssh]: https://en.wikipedia.org/wiki/Secure_Shell
[wp-apache]: https://en.wikipedia.org/wiki/Apache_HTTP_Server
[wp-handshake]: https://en.wikipedia.org/wiki/Three-way_handshake

