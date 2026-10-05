---
title: "How the Internet Works"
date: "2026-10-05"
summary: "How the Internet Works: DNS, HTTP, and TCP/IP Explained Simply"
description: "A beginner's map of the internet: networks, routing, BGP, DNS and CDNs, how real outages and hijacks happened, and commands to see it yourself."
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
tags: ["cybersecurity", "infosec", "beginners", "security-basics", "networking", "internet", "bgp", "dns", "cdn", "tcp-ip"]
categories: ["Cybersecurity", "Fundamentals"]
keywords: ["how the internet works", "how the internet works for beginners", "DNS HTTP TCP/IP explained", "what is BGP", "autonomous system explained", "internet routing basics", "BGP hijacking explained", "what is a CDN", "anycast explained", "submarine cables internet"]
series: ["Cybersecurity Foundations"]
series_order: 6
author: "Armoghan-ul-Mohmin"
showAuthorBottom: true
draft: false
showZenMode: false
---


{{< katex >}}

{{< lead >}}
On 24 February 2008, one Pakistani ISP tried to block YouTube for its own customers and accidentally took it offline for a large part of the world. Nobody hacked anything. A network told the rest of the internet something untrue, and the rest of the internet believed it.
{{< /lead >}}

## The short version

[Part two](/posts/how-computer-talk/) followed one conversation between two machines: addresses, ports, a handshake, a DNS lookup, an encrypted request. This part zooms out to the thing that conversation travels across. The internet is not a single network and nobody runs it. It is tens of thousands of independent networks that have agreed to pass each other's traffic along, using a routing protocol that mostly takes everyone at their word.

{{< alert icon="scale-balanced" >}}
**The one idea that carries this article:** the internet works because independent networks cooperate, and most of that cooperation runs on trust rather than verification. Where the trust is checked, it holds. Where it is not, outages and hijacks happen, and they look exactly like hacks even when nobody attacked anything.
{{< /alert >}}

Everything below is a direct consequence of that.

## What the internet physically is

Strip away the cloud imagery and the internet is buildings, cables, and radio:

- **Your last mile:** Wi-Fi, fibre, DSL, or a mobile connection, ending at your ISP
- **ISP networks:** regional cable and fibre, owned by the provider that bills you
- **Backbones:** long-haul fibre between cities and countries, owned by large carriers
- **Exchange points:** buildings where many networks plug into one switch and swap traffic directly
- **Data centres:** where the websites and services actually live
- **Submarine cables:** fibre on the seabed connecting continents

That last one surprises people. TeleGeography, which tracks the industry, lists 607 submarine cable systems in service in 2026, with another 102 planned. The great majority of intercontinental traffic travels along them, not via satellite. When a ship's anchor or an earthquake cuts one, entire countries slow down.

{{< alert icon="lightbulb" >}}
Physics sets a floor under all of this. Light in fibre travels at roughly 200,000 km/s, so the minimum time for a signal to cover distance \(d\) is \(t = d / v\). Karachi to London is about 6,300 km along the great circle, so a round trip cannot take less than roughly 63 ms, and real routes follow cables rather than straight lines. No amount of money makes that faster, which is why companies put copies of their content near you.
{{< /alert >}}

## A network of networks

The unit of the internet is the **autonomous system**, or AS: a network under one organisation's control that sets its own routing policy. Each one has a number (an ASN). Your ISP is one. So are Google, Cloudflare, a university, and a large bank. There are tens of thousands of them.

Autonomous systems connect in two ways, and the difference is mostly about money:

| Arrangement | How it works | Who pays |
| --- | --- | --- |
| **Transit** | A smaller network pays a larger one to carry its traffic to the rest of the internet | The customer |
| **Peering** | Two networks exchange traffic directly, usually only for each other's own customers | Usually nobody |

{{< mermaid >}}
graph TD
  home["You, on a home connection"]
  isp["Your ISP, AS A"]
  transit["Transit provider, AS B"]
  ixp["Internet exchange point"]
  cdn["CDN, AS C"]
  site["Website's host, AS D"]
  home --> isp
  isp -->|"buys transit"| transit
  isp ---|"peers"| ixp
  cdn ---|"peers"| ixp
  transit --> site
  cdn --> site
{{< /mermaid >}}

An **internet exchange point** (IXP) is a shared switch, often in a single building, where dozens or hundreds of networks connect and peer. Traffic that stays local stays local, which makes it faster and cheaper. A handful of the largest carriers, often called tier-1 networks, reach everywhere through peering alone and buy transit from nobody.

Nothing in this picture is centrally planned. Networks connect where it makes commercial sense, which is why internet topology looks more like a thicket than a tree.

## How a packet finds its way

No router knows the whole path to anywhere. Each one knows only the best **next hop** for a given destination, and passes the packet on. Every router holds a routing table: a list of prefixes, written in the CIDR form from part two, each pointing to a next hop.

When a packet arrives, the router finds every prefix that contains the destination address and picks the **longest** one. That is the longest prefix match, and it is the single most important rule in routing:

- `0.0.0.0/0` matches everything, so it is the default route, used when nothing more specific exists
- `208.65.152.0/22` matches 1,024 addresses
- `208.65.153.0/24` matches 256 of those, and it is more specific, so it wins for those 256

You can see your own machine's table on Linux:

```bash
ip route show             # your routing table, usually a default route plus your local subnet
ip route get 8.8.8.8      # which route would carry a packet to this address
```

{{< figure
    src="shot-01-routing-table.png"
    alt="Terminal output of ip route show and ip route get, showing a default route via the local gateway, the home subnet, and a VirtualBox host-only network"
    caption="A real home Linux routing table. Two routes cover the entire internet: the `/24` for your own network and a `/0` for everything else. The `virbr0` line is a VirtualBox host-only network from the lab in [part four](/tutorials/linux-101/)."
>}}

For most home machines the answer is the same: send everything not on the local network to the gateway. The gateway has a bigger table, and your ISP's routers a bigger one still.

## BGP: how networks tell each other what they can reach

Inside one network, routers learn paths using internal protocols. Between networks, the protocol is the **Border Gateway Protocol**, or BGP. It is how the internet's routing table gets built, and it works through announcements.

An autonomous system announces a prefix to its neighbours: "I can reach `203.0.113.0/24`." Each neighbour passes it on to its own neighbours, adding its own AS number to the front of a growing list called the **AS path**. By the time the announcement reaches you, the path shows the chain of networks it crossed:

{{< mermaid >}}
sequenceDiagram
  participant O as AS D, origin
  participant T as AS B, transit
  participant I as AS A, your ISP
  O->>T: I can reach 203.0.113.0/24, path: D
  T->>I: I can reach 203.0.113.0/24, path: B D
  Note over I: Installs the route and may announce it onward
{{< /mermaid >}}

When a router hears about the same prefix from several neighbours, it chooses by policy first, such as preferring a customer to a paid provider, and often by shortest AS path after that. This is business logic as much as engineering, which is why the fastest physical route is not always the one packets take.

The catch is in the word "announces". BGP was designed in an era of a few hundred cooperating networks, and by default a router accepts what its neighbour says. Nothing in the protocol itself checks that an AS is entitled to announce the prefix it announces.

### Failure one: the hijack that took YouTube offline

In February 2008 the Pakistani government ordered ISPs to block YouTube. Pakistan Telecom's approach was to announce a route for part of YouTube's address space inside its own network, so local traffic would go nowhere.

YouTube's real prefix was `208.65.152.0/22`. Pakistan Telecom announced a more specific `208.65.153.0/24`. The announcement was not meant to leave the country, but it leaked to its upstream provider, PCCW Global, which passed it on. Routers around the world saw two routes covering YouTube's servers and, under longest prefix match, chose the /24. Traffic meant for YouTube flowed towards Pakistan Telecom and disappeared. RIPE NCC's analysis puts the hijack at about two hours and fourteen minutes, from 18:47 to 21:01 UTC, ending when PCCW withdrew the route.

You can reproduce the decision a router made. This script implements longest prefix match:

```python
import ipaddress

def route(dest, table):
    ip = ipaddress.ip_address(dest)
    hits = [(ipaddress.ip_network(p), owner) for p, owner in table.items()
            if ip in ipaddress.ip_network(p)]
    return max(hits, key=lambda h: h[0].prefixlen)   # longest prefix wins

table = {
    "0.0.0.0/0":         "default route",
    "208.65.152.0/22":   "YouTube",
}
print(route("208.65.153.238", table))

table["208.65.153.0/24"] = "Pakistan Telecom"        # the 2008 announcement
print(route("208.65.153.238", table))

table["208.65.153.128/25"] = "YouTube, more specific"  # YouTube's counter-move
print(route("208.65.153.238", table))
print(route("8.8.8.8", table))
```

Running it prints:

```text
(IPv4Network('208.65.152.0/22'), 'YouTube')
(IPv4Network('208.65.153.0/24'), 'Pakistan Telecom')
(IPv4Network('208.65.153.128/25'), 'YouTube, more specific')
(IPv4Network('0.0.0.0/0'), 'default route')
```

{{< figure
    src="shot-02-longest-prefix.png"
    alt="Terminal output of a Python longest prefix match script, showing a YouTube /22 route being replaced by a Pakistan Telecom /24 and then by a YouTube /25"
    caption="The hijack replayed in five lines of Python. Each new announcement is more specific than the last, so it wins, until the victim out-specifies the hijacker."
>}}

The same rule that caused the problem also contained it. YouTube's response was to announce still more specific prefixes, two /25s, which beat the hijacker's /24 everywhere they were heard.

{{< figure
    src="shot-06-route-watch.png"
    alt="Terminal output of a route monitor watching YouTube prefixes over time, showing the original /22, then a more specific /24 from a different AS, then two /25s restoring service"
    caption="The 2008 event as a routing table saw it. Nothing was forged or corrupted. One network announced a more specific prefix than it owned, and a rule everyone had agreed to follow carried the traffic there."
>}}

Two hours and fourteen minutes later, PCCW withdrew the route and the announcements reverted. The whole incident is a protocol working exactly as specified.

### Failure two: the company that withdrew itself

On 4 October 2021, Facebook, Instagram, and WhatsApp disappeared for roughly seven hours. Meta's engineering post says a command issued during routine maintenance, meant to assess backbone capacity, unintentionally took down all the connections in its backbone. An audit tool that should have caught the command had a bug.

What turned a network fault into a total disappearance is the part worth studying. Facebook's DNS servers were built to withdraw their own BGP announcements if they could not reach the company's data centres, because that suggests an unhealthy network. With the backbone gone, they did exactly that. The routes to Facebook's authoritative DNS servers vanished from the global routing table. Nobody could resolve `facebook.com`, so nobody could find anything else either.

Recovery was slow for a related reason. The internal tools engineers would normally use depended on the same network and DNS, and Meta reported that staff had to go to data centres in person, where physical security slowed them down.

This was no attack, and it is a clean example of availability from [part five](/posts/understanding-the-cia-triad/) failing through a chain of defensive features. The safeguard that says "withdraw if you cannot reach the data centre" was correct in isolation. It became the outage because it ran without a human deciding.

### What fixes this

The main defence is **RPKI**, the Resource Public Key Infrastructure. The owner of a prefix publishes a signed record, a ROA, stating which AS may originate it and up to what length. Networks that perform *route origin validation* then drop announcements that contradict a ROA. Under that scheme, a /24 from the wrong AS for YouTube's space would be marked invalid and ignored.

RPKI has limits. It checks who originates a prefix, not whether the path to it is honest, and it only helps where it is deployed. Operators also filter their customers' announcements, and the MANRS initiative publishes baseline practices for doing so. The problem is improving, not solved.

## Names at global scale

Part two walked through a DNS lookup step by step, so only the scale matters here. At the top sit the **root servers**, which know who runs each top-level domain. There are 13 named root server identities, A to M, run by 12 independent organisations including Verisign, ICANN, RIPE NCC, NASA, and several universities.

Thirteen sounds fragile. It is not, because of **anycast**: many physical servers announce the same IP address from different places, and BGP routes you to whichever is nearest. As of 4 October 2026, root-servers.org counts 2,045 operational instances behind those 13 identities. If one site goes dark, routing simply sends traffic to the next closest.

Anycast is an unusual use of the routing system. It turns BGP's weakness, that the same prefix can be announced from many places, into a resilience feature.

## Moving content closer to you

Remember the latency floor from earlier. A site hosted in one data centre on another continent will always feel slow to a distant visitor, no matter how well it is built. A **content delivery network** (CDN) solves this by running servers in hundreds of locations and answering from the nearest one.

A CDN uses the pieces already covered:

- **DNS or anycast** steers you to a nearby edge server
- **Caching** means popular files are stored at the edge and never travel the long distance
- **TLS** is terminated at the edge, so the encrypted connection is short
- **Origin servers** are contacted only for content the edge does not already hold

For security this is a double-edged design. A large CDN can absorb a flood of malicious traffic that would flatten a single server, which is why so many sites sit behind one. But a handful of companies now carry a large share of web traffic, and when one has a bad day, a lot of unrelated sites fail together. That is the same concentration risk as the root servers, with fewer operators.

## Addresses ran out, so we share them

IPv4 has about 4.3 billion addresses, and the central pool of free ones was exhausted in 2011. Three things keep the internet running on them:

- **NAT**, which lets a whole household share one public address, with the router tracking which internal device each connection belongs to
- **Carrier-grade NAT** (CGNAT), where the ISP does the same thing across many customers, so you may not have a public address of your own at all. `100.64.0.0/10` is reserved for this, which is why the second hop in the [traceroute](#see-it-yourself) above starts with `100.65`
- **IPv6**, whose 128-bit addresses are plentiful enough that sharing is not needed, and which is slowly spreading

This has security consequences that are easy to miss. NAT is not a firewall, although it behaves a little like one for inbound connections. Under CGNAT you cannot easily host anything reachable from outside, and many people can share one visible address, so blocking or banning "an IP" can punish bystanders. And a machine with IPv6 enabled but no IPv6 firewall rules is reachable in ways its owner may not expect.

## Who can see what

HTTPS hides the content of your traffic, not the fact that it exists. Take one visit to a website and ask who learns what:

{{< tabs default="Your ISP" group="visibility" >}}
  {{< tab label="Your ISP" icon="search" >}}
  Sees the destination IP addresses, the timing and volume of your
  traffic, and your DNS queries unless you have encrypted them. Often
  sees the site name too, because it is sent in clear text during the TLS
  handshake. It does not see the pages or form data.
  {{< /tab >}}
  {{< tab label="The website" icon="cloud" >}}
  Sees your public IP address, your browser details, and everything you
  send it. Your IP gives a rough location and the name of your ISP, not
  your street address.
  {{< /tab >}}
  {{< tab label="The CDN" icon="shield" >}}
  Often sees the traffic in decrypted form, because it terminates the
  connection on the site's behalf. That is a deliberate trade for speed
  and protection.
  {{< /tab >}}
  {{< tab label="The Wi-Fi owner" icon="eye" >}}
  Sees what your ISP sees, plus which devices are on the network. On a
  network you do not control, such as a café or hotel, assume that.
  {{< /tab >}}
{{< /tabs >}}

A VPN does not make this go away. It moves the view from your ISP to the VPN company, which then sees what your ISP used to see. It is a change of who you trust, not removal of trust.

## See it yourself

All of this is observable from a terminal, using only tools you already have from the earlier parts. Run these on a machine and network you own.

```bash
dig +trace example.com
```

This performs the whole lookup yourself, starting at a root server, then a `.com` server, then the domain's own nameserver. You are walking the hierarchy from the DNS section.

```bash
traceroute -n 8.8.8.8
```

Each line is a router on the way. Notice where the latency jumps: a large step often marks a long-distance link, such as a submarine cable.

{{< figure
    src="shot-03-traceroute.png"
    alt="Terminal output of a traceroute from Karachi showing nine hops, with latency jumping from 4.7ms to 24ms at hop four and no reply after hop six"
    caption="A real trace from Karachi to Cloudflare. The jump from 4.7 ms to 24.2 ms at hop 4 is where the path left the country. Hop 2's `100.65.x.x` address is carrier-grade NAT space, reserved by RFC 6598. The `no reply` lines mean that router drops our probes, not that it is down."
>}}

The article says to look up the AS of each hop. Here is what that looks like:

```bash
whois -h whois.cymru.com " -v 8.8.8.8"
whois -h whois.cymru.com " -v 1.1.1.1"
```

{{< figure
    src="shot-04-as-lookup.png"
    alt="Terminal output of a Team Cymru whois lookup showing AS 136969 KK Networks for a Karachi hop and AS 15169 Google for 8.8.8.8"
    caption="Mapping a hop address to the network that announces it. `103.125.177.52` belongs to KK Networks, AS 136969; `8.8.8.8` is Google, AS 15169. Every hop on your path is a different organisation."
>}}

This maps an IP address to the autonomous system that announces it. Expect AS 15169 (Google) and AS 13335 (Cloudflare). Some networks block the whois port, so if it hangs, try another network.

```bash
curl -s https://www.cloudflare.com/cdn-cgi/trace | grep -E 'colo|loc|ip'
```

The `colo` line is the three-letter airport code of the Cloudflare site that answered you. That is anycast working: the same address, answered by whichever location is closest to your network.

{{< figure
    src="shot-05-anycast.png"
    alt="Terminal output of a Cloudflare trace request showing colo=KHI and loc=PK for Karachi, compared to colo=FRA for a friend in Germany"
    caption="Anycast, measured. One address, `www.cloudflare.com`, answered by Karachi (`KHI`) for this connection and Frankfurt (`FRA`) for a friend in Germany. No DNS record changes; BGP simply routes each request to the nearest instance."
>}}

Here `KHI` is Karachi. Run it on a home connection and again on a hotspot or VPN, and the three letters usually change. That difference is BGP steering a request across the planet without anyone editing a name.

{{< alert icon="lightbulb" >}}
Compare the traceroute from your home connection and from a phone hotspot. Same destination, different ISPs, often completely different paths. That is the network of networks made visible.
{{< /alert >}}

## Test yourself

{{< accordion mode="collapse" >}}
  {{< accordionItem title="Two routes cover the same address: a /22 from the owner and a /24 from a stranger. Which do routers choose?" icon="search" >}}
  The /24. Longest prefix match prefers the more specific route, regardless
  of who announced it. This is why a hijacker announces a smaller block
  than the victim's, and why the victim's answer is to announce smaller
  blocks still.
  {{< /accordionItem >}}
  {{< accordionItem title="Facebook's servers were running fine during the 2021 outage. Why could nobody reach them?" icon="bug" >}}
  Their routes had been withdrawn. Without announcements, no router knew
  where Facebook's DNS servers were, so names stopped resolving. A service
  can be healthy and still unreachable, which is an availability failure
  even with nothing broken inside it.
  {{< /accordionItem >}}
  {{< accordionItem title="Does a padlock in the browser stop a BGP hijack?" icon="lock" >}}
  Not entirely. Traffic diverted to the wrong network should fail the TLS
  certificate check, so the attacker cannot quietly read it, but the
  victim is still unreachable, which is a denial of service. The risk
  rises if an attacker can also obtain a valid certificate for the
  domain, which is one reason certificate issuance is monitored.
  {{< /accordionItem >}}
  {{< accordionItem title="Why do the root servers survive the loss of an entire data centre?" icon="cloud" >}}
  Anycast. Each root identity is served from many sites using the same IP
  address, so routing sends clients to the next nearest working instance.
  {{< /accordionItem >}}
{{< /accordion >}}

## What goes wrong at internet scale

[Part two](/posts/how-computer-talk/) ended with protocol-level trust assumptions. These are the larger ones:

| Component | What it trusts | How it fails | What helps |
| --- | --- | --- | --- |
| BGP | Neighbours announce only what they own | Hijacks and route leaks divert or blackhole traffic | RPKI, route filtering, MANRS practices |
| DNS | The answer is genuine | Hijacked records, poisoned caches, expired domains | DNSSEC, registrar locks, monitoring |
| CDNs | A few providers stay up | One outage takes down thousands of sites | Multi-provider design, failover plans |
| Spoofable protocols | Source addresses are honest | Amplified DDoS from reflected UDP traffic | Ingress filtering at ISPs |
| Cables and exchanges | Physical paths stay intact | A cut or outage isolates a region | Route diversity, more cable systems |
| CGNAT | Many users can share an address | Collateral blocking, hard to attribute | IPv6 |

A pattern runs through every row. The weakness is rarely a bug that can be patched. It is a design that assumed good behaviour, and the fix is added later, unevenly, by thousands of operators who each decide separately.

## Where to go from here

You now have the whole stack in view: a packet's journey from part two, and the network of networks it crosses.

- Run `traceroute` to five different sites and look up the AS of each hop
- Browse a looking glass or a BGP monitoring site, and watch announcements change in real time
- Read the RIPE NCC write-up of the YouTube hijack, which is short and readable
- Read Meta's own account of the 2021 outage, and notice how many safeguards each contributed to the failure
- Find out whether your ISP does route origin validation, and whether the sites you rely on publish ROAs
- Run `ip route get` and `traceroute` against the two machines in your [home lab](/tutorials/linux-101/), then against a public host, and compare the first hop

Every command in this article works from a normal Linux terminal. If you would rather practise on machines that are already wired up, the [cyber range](/terminal/) gives you a shell with the same tools and a set of challenges to run them against.

The [tutorials](/tutorials/) have hands-on exercises for putting this to use, the [cheatsheets](/cheatsheet/) are the place for quick reference, and the [writeups](/writeups/) cover real problems from start to finish.

{{< alert icon="graduation-cap" >}}
This is the sixth entry in the **Cybersecurity Foundations** series. [Part one](/posts/what-is-cybersecurity-really/) covered risk, [part two](/posts/how-computer-talk/) the conversation between two machines, [part three](/posts/the-command-line-isnt-scary/) the terminal, [part four](/tutorials/linux-101/) a lab to practise in, and [part five](/posts/understanding-the-cia-triad/) the three properties everything is measured against. This part covers the network of networks that conversation crosses.
{{< /alert >}}

Spotted a mistake or something unclear? The [contact page](/contact/) is the fastest way to reach me.

## References

- [RIPE NCC: YouTube Hijacking, a RIPE NCC RIS case study][ripe-youtube]
- [Meta Engineering: More details about the October 4 outage][meta-outage]
- [ThousandEyes: Facebook outage analysis][te-facebook]
- [TeleGeography: How many submarine cables are there?][telegeography]
- [Root Server Technical Operations Association: root-servers.org][root-servers]
- [RFC 4271: A Border Gateway Protocol 4 (BGP-4)][rfc4271]
- [RFC 6480: An Infrastructure to Support Secure Internet Routing][rfc6480]
- [RFC 4786: Operation of Anycast Services][rfc4786]
- [RFC 1918: Address Allocation for Private Internets][rfc1918]
- [RFC 6598: IANA-Reserved IPv4 Prefix for Shared Address Space (CGNAT)][rfc6598]
- [MANRS: Mutually Agreed Norms for Routing Security][manrs]
- [Cloudflare Learning Center: What is BGP?][cf-bgp]

[ripe-youtube]: https://www.ripe.net/news/study-youtube-hijacking.html
[meta-outage]: https://engineering.fb.com/2021/10/05/networking-traffic/outage/
[te-facebook]: https://www.thousandeyes.com/blog/facebook-outage-analysis
[telegeography]: https://resources.telegeography.com/how-many-submarine-cables-are-there-anyway
[root-servers]: https://root-servers.org/
[rfc4271]: https://www.rfc-editor.org/rfc/rfc4271
[rfc6480]: https://www.rfc-editor.org/rfc/rfc6480
[rfc4786]: https://www.rfc-editor.org/rfc/rfc4786
[rfc1918]: https://www.rfc-editor.org/rfc/rfc1918
[rfc6598]: https://www.rfc-editor.org/rfc/rfc6598
[manrs]: https://www.manrs.org/
[cf-bgp]: https://www.cloudflare.com/learning/security/glossary/what-is-bgp/
