---
title: "How Computer Talk"
date: "2026-09-30"
summary: "How Computer Talks: Networking Basics Every Hacker Needs"
description: "Networking basics for security beginners: TCP/IP layers, addresses and ports, TCP vs UDP, DNS, HTTP and TLS, and the trust assumptions attackers abuse."
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
tags: ["cybersecurity", "infosec", "beginners", "security-basics","networking", "tcp-ip", "osi-model", "dns", "http", "tls"]
categories: ["Cybersecurity", "Fundamentals"]
keywords: ["networking basics for hackers", "how computers communicate", "TCP/IP explained,OSI model vs TCP/IP", "TCP three-way handshake", "how DNS works,how HTTP works", "TLS explained for beginners", "common ports and protocols", "networking for cybersecurity beginners"]
series: ["Cybersecurity Foundations"]
series_order: 2
author: "Armoghan-ul-Mohmin"
showAuthorBottom: true
draft: false
showZenMode: true
---

{{< lead >}} Every attack you will ever read about, from a phishing link to a ransomware outbreak, comes down to two computers exchanging messages. If you cannot read that conversation, you cannot tell which parts are normal, and you cannot tell which part is the attack. {{< /lead >}}

## The short version

Computers talk by following protocols: published, agreed rules for how a message is addressed, packaged, delivered, and understood. No single rule does everything. Networking is a stack of small rules, each solving one problem and trusting the layer below it to have solved the rest.

{{< alert icon="scale-balanced" >}}
**The one idea that carries this article:** the protocols that run the internet were designed for cooperation, not for adversaries. Most network attacks are not clever breakages. They are someone using a rule exactly as written, in a situation its designers assumed would never happen.
{{< /alert >}}

Everything below is a direct consequence of that.

## Why this comes before any tool

Before you run a scanner or open a packet capture, it helps to see how much of an attack is just network activity:

- **Reconnaissance** is asking the network questions: DNS lookups, port scans, banner grabs
- **Initial access** is sending something to a service that is listening on a port
- **Lateral movement** is one internal machine talking to another it has never spoken to before
- **Exfiltration** is data leaving through a protocol that was allowed to leave

Defenders see the same four things from the other side. Whether you attack or defend, the raw material is packets.

## Layers keep the problem manageable

Think about posting a parcel. You care about the contents. The post office cares about the address label. The sorting depot cares about the region. The lorry cares about the road. Nobody holds the whole job in their head, and nobody needs to.

Networking works the same way. Each layer wraps what it receives from above with its own header, then hands the result down. The receiver unwraps in reverse.

{{< mermaid >}}
graph TD
  app["Application: your data, such as an HTTP request"]
  transport["Transport: adds ports, becomes a segment"]
  network["Internet: adds IP addresses, becomes a packet"]
  link["Link: adds MAC addresses, becomes a frame"]
  wire["Physical: bits on copper, fibre, or radio"]
  app --> transport
  transport --> network
  network --> link
  link --> wire
{{< /mermaid >}}

This is why a packet capture looks like nesting dolls, and why a control working at one layer can be completely blind to what happens at another.

| Layer (TCP/IP) | OSI layers | Unit | Examples | Typical attack angle |
| --- | --- | --- | --- | --- |
| Application | 5 to 7 | Data | HTTP, DNS, SMTP, SSH | Injection, phishing, protocol misuse |
| Transport | 4 | Segment or datagram | TCP, UDP | Port scans, SYN floods |
| Internet | 3 | Packet | IP, ICMP | Spoofed source addresses, routing abuse |
| Link | 1 and 2 | Frame | Ethernet, Wi-Fi, ARP | ARP spoofing, rogue access points |

> [!NOTE]
> The seven-layer OSI model is a teaching tool. The four-layer TCP/IP model is closer to what real systems implement. Security people still use OSI numbers as shorthand ("a layer 7 firewall", "a layer 2 attack"), so learn both and know which one you are talking about.

## Three kinds of address

"Where is this message going?" has three different answers, one at each of three layers.

{{< tabs default="MAC" group="addresses" >}}
  {{< tab label="MAC" icon="link" >}}
  A 48-bit hardware address, written like `3c:22:fb:12:ab:9e`. It identifies
  a network interface **on the local link only**. Routers rewrite it at
  every hop, so it never travels across the internet. It is easy to change
  in software, so it is a label, not proof of identity.
  {{< /tab >}}
  {{< tab label="IPv4" icon="code" >}}
  A 32-bit address, written as four numbers like `192.168.1.20`. It
  identifies a host on a network and lets routers move traffic between
  networks. Three ranges are reserved for private use (RFC 1918):
  `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. NAT lets many
  private machines share one public address.
  {{< /tab >}}
  {{< tab label="IPv6" icon="cloud" >}}
  A 128-bit address written in hexadecimal, like `2001:db8::1`. It exists
  because IPv4 ran out. It is also a classic blind spot: a machine with
  IPv6 enabled and no IPv6 firewall rules is reachable in a way its owner
  may not realise.
  {{< /tab >}}
  {{< tab label="Port" icon="lock" >}}
  A 16-bit number from 0 to 65535 that identifies **which service** on a
  host should receive the traffic. Ports 0 to 1023 are the well-known
  ones. If the IP address gets you to the building, the port gets you to
  the right door.
  {{< /tab >}}
{{< /tabs >}}

### Subnets

A CIDR block such as `192.168.1.0/24` means the first 24 bits identify the network and the remaining bits identify hosts on it. The number of addresses in a block is:

{{< katex >}}
$$
2^{32-n}
$$

where \(n\) is the prefix length. A /24 gives \(2^8 = 256\) addresses, of which 254 are usable once the network and broadcast addresses are set aside.

Subnet boundaries matter for security because machines in the same subnet talk directly at the link layer. That traffic usually never passes through a router, so it never meets a firewall unless you deliberately put one there.

### Ports you will see constantly

| Port | Protocol | Service | Why attackers care |
| --- | --- | --- | --- |
| 22 | TCP | SSH | Brute force, stolen keys |
| 25 | TCP | SMTP | Spoofed mail, open relays |
| 53 | UDP and TCP | DNS | Reconnaissance, tunnelling |
| 80 | TCP | HTTP | Web applications, plain-text traffic |
| 443 | TCP and UDP | HTTPS | Web applications (HTTP/3 uses UDP) |
| 445 | TCP | SMB | File sharing, lateral movement |
| 3389 | TCP | RDP | Remote access, a common ransomware entry point |

{{< alert icon="lightbulb" >}}
Port numbers are convention, not law. Anything can listen anywhere. "Port 80 is HTTP" is a reasonable guess, not a fact, and you confirm it by talking to the service.
{{< /alert >}}

## TCP and UDP

Both sit at the transport layer and both use ports. They make opposite trade-offs.

{{< accordion mode="open" >}}
  {{< accordionItem title="TCP: reliable, ordered, connection-based" icon="check" open=true >}}
  Sets up a connection first, numbers every byte, acknowledges what arrives,
  and resends what does not. Web pages, SSH, email, and file transfers use
  it because losing a byte matters. The cost is setup time and state kept
  on both ends.
  {{< /accordionItem >}}
  {{< accordionItem title="UDP: fast, connectionless, no guarantees" icon="bomb" >}}
  Sends and hopes. No handshake, no retransmission, no ordering. DNS
  queries, video calls, games, and QUIC use it because a late answer is
  worse than a lost one. The lack of a handshake also makes source
  addresses easy to fake, which is why UDP is popular for amplification
  attacks.
  {{< /accordionItem >}}
{{< /accordion >}}

TCP starts every connection with a three-way handshake:

{{< mermaid >}}
sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: SYN - I want to talk, my sequence number is X
  S->>C: SYN-ACK - Agreed, mine is Y, and I got X
  C->>S: ACK - Got Y, go ahead
  Note over C,S: Connection established
{{< /mermaid >}}

### What a port scan is actually asking

A scanner sends a SYN to a port and classifies whatever comes back:

- **SYN-ACK** means something is listening (open)
- **RST** means nothing is listening, but the host is there (closed)
- **Silence** usually means a firewall dropped the packet (filtered)

That is all a tool like Nmap is doing, at scale and with a great deal of refinement.

{{< alert icon="triangle-exclamation" >}}
Only scan networks you own or have written permission to test. "I was only looking" has never worked as a defence, and the rules differ by country and by network provider.
{{< /alert >}}

## DNS is a phone book nobody signs

People remember names. Machines route on numbers. DNS translates between them, and almost everything you do online starts with a DNS lookup.

{{< mermaid >}}
sequenceDiagram
  participant D as Your device
  participant R as Recursive resolver
  participant Root as Root servers
  participant TLD as .com servers
  participant A as example.com nameserver
  D->>R: Where is www.example.com?
  R->>Root: Who handles .com?
  Root->>R: Ask the .com servers
  R->>TLD: Who handles example.com?
  TLD->>R: Ask this nameserver
  R->>A: What is www.example.com?
  A->>R: 203.0.113.10
  R->>D: 203.0.113.10
{{< /mermaid >}}

Your resolver caches the answer, so most lookups never go this far.

| Record | Maps | Security relevance |
| --- | --- | --- |
| A | Name to IPv4 address | Shows where a service actually lives |
| AAAA | Name to IPv6 address | Often forgotten in firewall rules |
| CNAME | Name to another name | Dangling ones enable subdomain takeover |
| MX | Domain to mail servers | Reveals email providers |
| NS | Domain to nameservers | Shows who controls the zone |
| TXT | Free-form text | Holds SPF, DKIM, and DMARC policies, and verification tokens |

Original DNS has no authentication. A resolver believes a well-formed answer that arrives at the right moment, which is the whole basis of cache poisoning. DNSSEC adds signatures so answers can be verified. DNS over HTTPS and DNS over TLS encrypt the query so the path cannot read it. They solve different problems, and neither is universally deployed.

{{< accordion mode="collapse" >}}
  {{< accordionItem title="Reconnaissance" icon="search" >}}
  Enumerating subdomains often exposes forgotten systems: old staging
  servers, test environments, admin panels. Public certificate
  transparency logs list many of them without sending a single packet
  to the target.
  {{< /accordionItem >}}
  {{< accordionItem title="Abuse" icon="bug" >}}
  Lookalike domains power phishing. DNS tunnelling encodes stolen data
  into queries for a domain the attacker controls, because DNS is
  allowed out of almost every network.
  {{< /accordionItem >}}
  {{< accordionItem title="Detection" icon="eye" >}}
  Log DNS queries. Long random-looking subdomains, or a large volume
  of TXT queries to a single domain, are classic signs of tunnelling.
  {{< /accordionItem >}}
{{< /accordion >}}

## HTTP is just text

The web runs on a plain-text conversation. A request looks like this:

```http
GET /login HTTP/1.1
Host: example.com
User-Agent: curl/8.5.0
Accept: */*
```

And a response:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Set-Cookie: session=abc123; HttpOnly; Secure
Content-Length: 1256
```

Because it is text, every web attack is some form of text manipulation: changing a parameter, forging a header, stealing a cookie, or smuggling something the server did not expect into a field.

The status code is the server's first clue to you:

- **2xx** means success
- **3xx** means redirect
- **4xx** means the client did something wrong. A `403 Forbidden` and a `404 Not Found` that behave differently can reveal that a resource exists
- **5xx** means the server failed. A `500` in response to odd input often means you broke something worth investigating

### TLS adds a lock

HTTPS is HTTP carried inside TLS. TLS gives you three things, and if they sound familiar it is because they are the CIA triad from part one wearing different clothes:

- **Confidentiality:** nobody on the path can read the traffic
- **Integrity:** nobody on the path can alter it unnoticed
- **Authentication:** a certificate signed by an authority your device trusts shows you reached the owner of that domain

> [!IMPORTANT]
> The padlock means the connection is encrypted to whoever owns that domain. It does not mean the owner is honest. Phishing sites use HTTPS routinely. Encryption also hides content but not metadata: IP addresses, timing, traffic volume, and often the server name are still visible to anyone watching the wire.

## One request, end to end

Here is what happens when you run `curl https://example.com`:

{{< timeline >}}
  {{< timelineItem
    icon="search"
    header="Look up the name"
    badge="DNS"
    subheader="Application layer"
    md=true
  >}}
  Your device asks its resolver for the IP address of `example.com`, and
  usually gets an answer from a cache.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="link"
    header="Find the next hop"
    badge="Link"
    subheader="ARP and routing"
    md=true
  >}}
  The destination is not on your subnet, so your device sends the traffic
  to its default gateway. It uses ARP to learn the gateway's MAC address.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="check"
    header="Open the connection"
    badge="TCP"
    subheader="Transport layer"
    md=true
  >}}
  The three-way handshake to port 443 on the server.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="lock"
    header="Secure it"
    badge="TLS"
    subheader="Between transport and application"
    md=true
  >}}
  The client and server agree on keys, and the server proves its identity
  with a certificate. Everything after this point is encrypted.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="code"
    header="Ask"
    badge="HTTP"
    subheader="Application layer"
    md=true
  >}}
  The request you saw earlier, `GET / HTTP/1.1`, sent inside the encrypted
  channel.
  {{< /timelineItem >}}
  {{< timelineItem
    icon="file-lines"
    header="Answer and close"
    badge="HTTP"
    subheader="Application layer"
    md=true
  >}}
  The server sends the response, and either side closes the connection or
  keeps it open for the next request.
  {{< /timelineItem >}}
{{< /timeline >}}

Six steps, four protocols, three layers, and a fraction of a second. Each step is somewhere an attack can happen and somewhere a defender can look.

## See it yourself

Reading about packets is much less useful than watching them. On a machine and network you own, try these:

```bash
ip addr                    # your interfaces and addresses (ipconfig on Windows)
ping -c 4 example.com      # is the host reachable, and how quickly
dig example.com A +short   # ask DNS directly (nslookup on Windows)
traceroute example.com     # the routers between you and the target (tracert on Windows)
curl -v https://example.com   # the whole conversation, with handshake details
ss -tuln                   # what your own machine is listening on (netstat -an on Windows)
```

Then open Wireshark, start a capture on your active interface, and run `curl -v http://example.com`. Filter with `dns` first, then `http`, and follow the TCP stream. You will see the request in plain text, exactly as shown above.

{{< alert icon="lightbulb" >}}
Repeat the capture with `https://` and follow the stream. The difference between readable and unreadable is the entire argument for TLS, and it is more convincing than any paragraph.
{{< /alert >}}

## Trust assumptions attackers abuse

Almost every classic network attack is a protocol doing what it was designed to do for someone it was never designed for.

| Protocol | What it assumed | How it gets abused | What helps |
| --- | --- | --- | --- |
| ARP | Anyone on the local network answers honestly | ARP spoofing redirects local traffic through the attacker | Port security, dynamic ARP inspection, encrypted protocols |
| DHCP | The first server to answer is legitimate | A rogue server hands out the attacker's gateway or DNS | DHCP snooping |
| DNS | A plausible answer is a true one | Cache poisoning, hijacking, tunnelling | DNSSEC, DoH or DoT, DNS logging |
| SMTP | The sender field is honest | Spoofed sender addresses | SPF, DKIM, DMARC |
| TCP | Anyone who sends a SYN wants a connection | SYN floods exhaust connection state | SYN cookies, rate limiting, upstream filtering |
| HTTP (plain) | The path between client and server is private | Sniffing and tampering | HTTPS, HSTS |

None of these are bugs in the sense of a coding mistake. They are design decisions from an era when the network was a handful of universities that trusted each other. The fixes were added later, which is why they are inconsistent, and why so many networks still have the gaps.

## What defenders do with this

The defensive habits follow directly from the table above:

- **Segment the network**, so one compromised machine cannot reach everything
- **Filter outbound traffic**, not just inbound, so malware has a harder time calling home
- **Log DNS and flow data**, because they show behaviour even when the content is encrypted
- **Encrypt internal traffic**, since an attacker inside the perimeter can sniff it otherwise
- **Learn what normal looks like**, because you cannot spot a strange conversation without a baseline

This is defence in depth from part one, applied to the wire.

## Where to go from here

You do not need to memorise every protocol. You need enough of a mental model to read a capture and ask sensible questions about it.

- Practise subnetting until `/24`, `/16`, and `/8` are automatic
- Learn ten Wireshark display filters and use them on your own traffic
- Read the short, readable sections of one real RFC, starting with the TCP handshake
- Build a two-machine home lab you are allowed to break
- Only then reach for scanners, once you know what they are asking

Once the vocabulary sticks, the [tutorials](/tutorials/) are the place to practise it and the [cheatsheets](/cheatsheet/) are the place to look things up. The [tools](/tools/) section covers the software mentioned here in more depth.

{{< alert icon="graduation-cap" >}}
This is the second entry in the **Cybersecurity Foundations** series. Part one covered the language of risk. This part covers the wire that risk travels over.
{{< /alert >}}

Spotted a mistake or something unclear? The [contact page](/contact/) is the fastest way to reach me.

## References

- [RFC 9293: Transmission Control Protocol (TCP)][rfc9293]
- [RFC 791: Internet Protocol][rfc791]
- [RFC 1035: Domain Names, Implementation and Specification][rfc1035]
- [RFC 9110: HTTP Semantics][rfc9110]
- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3][rfc8446]
- [RFC 826: An Ethernet Address Resolution Protocol][rfc826]
- [RFC 1918: Address Allocation for Private Internets][rfc1918]
- [IANA: Service Name and Transport Protocol Port Number Registry][iana-ports]
- [MDN: An overview of HTTP][mdn-http]
- [Nmap Reference Guide: Port Scanning Basics][nmap-basics]
- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/)
- [Wikipedia: Internet protocol suite][wp-ip-suite]
- [Wikipedia: OSI model][wp-osi]

[rfc9293]: https://www.rfc-editor.org/rfc/rfc9293
[rfc791]: https://www.rfc-editor.org/rfc/rfc791
[rfc1035]: https://www.rfc-editor.org/rfc/rfc1035
[rfc9110]: https://www.rfc-editor.org/rfc/rfc9110
[rfc8446]: https://www.rfc-editor.org/rfc/rfc8446
[rfc826]: https://www.rfc-editor.org/rfc/rfc826
[rfc1918]: https://www.rfc-editor.org/rfc/rfc1918
[iana-ports]: https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml
[mdn-http]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
[nmap-basics]: https://nmap.org/book/man-port-scanning-basics.html
[wp-ip-suite]: https://en.wikipedia.org/wiki/Internet_protocol_suite
[wp-osi]: https://en.wikipedia.org/wiki/OSI_model
