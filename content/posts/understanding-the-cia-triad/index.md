---
title: "Understanding the CIA Triad"
date: "2026-10-03"
summary: "Understanding the CIA Triad (and Why It Actually Matters)"
description: "What confidentiality, integrity and availability really mean, how real attacks break each one, and how to use the triad to reason about risk."
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
tags: ["cybersecurity", "infosec", "beginners", "security-basics", "cia-triad", "risk-management", "confidentiality", "integrity", "availability"]
categories: ["Cybersecurity", "Fundamentals"]
keywords: ["CIA triad explained", "confidentiality integrity availability", "CIA triad examples", "CIA triad in cybersecurity", "DAD triad", "Parkerian hexad", "information security principles", "real world CIA triad attacks", "how to apply the CIA triad", "security fundamentals for beginners"]
series: ["Cybersecurity Foundations"]
series_order: 5
author: "Armoghan-ul-Mohmin"
showAuthorBottom: true
draft: false
showZenMode: true
---


{{< katex >}}

{{< lead >}}
Every security course teaches the CIA triad in week one, and most people have forgotten the details by week three. That is a shame, because it is one of the most useful questions in the field: when this goes wrong, which promise did it break?
{{< /lead >}}

## The short version

[Part one](/posts/what-is-cybersecurity-really/) introduced the triad in a few paragraphs. This is the long version: what each property demands, how real incidents break them, why they pull against each other, and how to use them as a working tool rather than a vocabulary list.

The three properties are:

- **Confidentiality:** only the right people can see it
- **Integrity:** it has not been changed without permission, and you can tell
- **Availability:** it works when someone needs it

{{< alert icon="scale-balanced" >}}
**The one idea that carries this article:** every security failure breaks at least one of three promises. Naming which one is half of diagnosing it. The other half is noticing that it is usually more than one.
{{< /alert >}}

## Confidentiality: the right eyes only

Confidentiality means access is limited to the people and systems that are meant to have it. That covers secrets, personal data, and anything whose value depends on staying private. The useful question is not "is it encrypted?" but "who could read this, and what would a thief see?"

The usual controls:

- Access control and least privilege, so people can reach only what their job needs
- Encryption in transit and at rest
- Multi-factor authentication on anything that holds or unlocks sensitive data
- Data classification, so you know which data deserves the effort
- Secure disposal of old drives, backups, and paperwork

**A real failure.** In 2017, attackers entered Equifax through a flaw in Apache Struts, a web application framework. The fix had been published in March. It had not been applied to the affected system, and the attackers stayed inside for weeks, eventually taking personal data on roughly 147 million people. Reviews afterwards found that the company lacked a complete inventory of where the vulnerable software ran.

Nothing clever was needed. A known flaw with a known fix was enough. Confidentiality, in other words, depends heavily on unglamorous work like patching and knowing what you own.

Most confidentiality failures are duller than that: an email to the wrong recipient, a cloud storage bucket left public, a laptop screen visible on a train. And confidentiality has a harsh property the other two lack. Once data has leaked, you cannot restore it.

## Integrity: unchanged, and provably so

Integrity covers three things that are easy to blur together:

- **Data integrity:** the numbers, files, and records are correct
- **System integrity:** the software and configuration are what you think they are
- **Origin:** the thing really came from who it claims to come from

Integrity attacks are frightening because they are quiet. A stolen database tends to be noticed eventually. A single altered payment instruction, a tweaked medical record, or a log entry quietly deleted can sit unnoticed for months.

The usual controls:

- Hashes and checksums, to detect change
- Digital signatures and code signing, to prove who made something
- Version control and change approval, so changes are visible and attributable
- File integrity monitoring on critical systems
- Input validation, so applications do not accept data that corrupts them
- Backups, so you can restore a known-good state

You can see the core idea in a few lines:

```bash
echo "Pay Alice 100" > payment.txt
sha256sum payment.txt > payment.sha256     # record the fingerprint
sha256sum -c payment.sha256                # payment.txt: OK

echo "Pay Alice 900" > payment.txt         # someone edits the file
sha256sum -c payment.sha256                # payment.txt: FAILED
```

Change one character and the fingerprint is completely different. That is what you did in [part four](/tutorials/linux-101/) when you checked your Kali and Ubuntu downloads against their published checksums.

There is a catch worth understanding. Anyone who can edit `payment.txt` can probably edit `payment.sha256` too, so a bare checksum only detects accidents. To defend against a deliberate attacker, the fingerprint has to be protected separately: stored somewhere they cannot reach, or signed with a key they do not hold. That is why Kali also publishes signed checksum files.

**Real failures.** Stuxnet, discovered in 2010, sabotaged centrifuges at an Iranian enrichment plant by changing how the industrial controllers drove them, while operators were shown normal readings. Both the machines and the readings were untrustworthy. In the 2020 SolarWinds incident, attackers inserted malicious code into legitimate software updates, which were then delivered to thousands of customers. The assumption that "what I installed is what the vendor shipped" turned out to be false.

## Availability: there when it is needed

Availability means authorised users can reach the system or data when they need it. It is the property people most often forget is a security concern, until it fails.

The usual controls:

- Redundancy, so one failure does not take everything down
- Backups that have actually been restored in a test, because an untested backup is an assumption, not a control
- Patching and capacity planning
- Protection against denial-of-service attacks
- An incident response plan and a disaster recovery plan

Two numbers matter when you plan for failure. The **recovery time objective** is how long you can afford to be down. The **recovery point objective** is how much data you can afford to lose. They are business decisions, not technical ones.

Availability is usually quoted as a percentage, and the gaps between the "nines" are bigger than they look:

$$
\text{downtime per year} = (1 - A) \times 8760 \text{ hours}
$$

where \(A\) is availability as a fraction, so 99.9% is \(A = 0.999\).

| Availability | Downtime per year |
| --- | --- |
| 99% | About 3.65 days |
| 99.9% | About 8.76 hours |
| 99.99% | About 52.6 minutes |
| 99.999% | About 5.3 minutes |

**A real failure.** In May 2021, ransomware from the group DarkSide hit Colonial Pipeline's billing infrastructure. The company halted the entire pipeline as a precaution, which stopped fuel deliveries along much of the US East Coast for six days. The oil pumping systems themselves kept running, and reporting indicated the attackers never controlled them. The outage came from a decision to stop, because nobody could bill customers and nobody could be sure what else had been reached.

That is the detail worth keeping. The pipe was fine. The computers that make a pipe commercially usable were not, and that was enough.

Availability also fails without any attacker. A bad update, an expired certificate, a misconfigured firewall rule, or a failed disk looks identical to users. The triad does not care why.

## The three pull against each other

You cannot maximise all three. Almost every control that helps one costs something elsewhere:

| Decision | Helps | Costs |
| --- | --- | --- |
| Lock an account after five failed logins | Confidentiality, by blocking guessing | Availability, since an attacker can lock real users out on purpose |
| Encrypt backups with a key kept offline | Confidentiality | Availability, because losing the key means losing the backups |
| Keep copies of data in several places | Availability | Confidentiality, since there are more places to leak from |
| Require approval for every change | Integrity | Availability and speed, because fixes now wait |
| Log everything | Integrity and accountability | Confidentiality, because logs hold sensitive data |
| Require MFA for every action | Confidentiality | Availability, when a phone is lost or the provider is down |

Which property comes first depends on what the system is for:

{{< tabs default="Hospital" group="priority" >}}
  {{< tab label="Hospital" icon="shield" >}}
  **Availability and integrity.** A ward locked out of its records, or a
  wrong entry in a drug chart, harms patients faster than a leak does.
  Confidentiality still matters, legally and ethically, but it rarely
  wins an argument with patient safety.
  {{< /tab >}}
  {{< tab label="Bank ledger" icon="scale-balanced" >}}
  **Integrity first.** Balances must be right and every change must be
  attributable and auditable. Availability comes next, since customers
  need access, and confidentiality protects both the bank and its clients.
  {{< /tab >}}
  {{< tab label="Whistleblower platform" icon="lock" >}}
  **Confidentiality above all.** If the source is exposed, the service has
  failed at its only real job. Availability is worth trading away if
  that is what it takes to protect anonymity.
  {{< /tab >}}
  {{< tab label="Public website" icon="cloud" >}}
  **Integrity and availability.** The content is public, so reading it is
  not the risk. Defacement, injected malware, and downtime are. Admin
  credentials and visitor data still need protecting.
  {{< /tab >}}
{{< /tabs >}}

<br>

{{< alert icon="lightbulb" >}}
There is no correct ordering, only a defensible one. Security decisions are priority decisions, and someone should have made them on purpose rather than by default.
{{< /alert >}}

## Using the triad as a diagnostic tool

Here is the practical version. For any asset, ask three questions:

1. What would happen if someone **saw** it?
2. What would happen if someone **changed** it?
3. What would happen if it were **gone or unreachable for a day**?

Rate each answer low, moderate, or high. This is more or less what NIST's FIPS 199 standard does for US federal systems, and it sets the overall category from the highest of the three ratings, known as the high-water mark. Its own worked examples include a public web server, where confidentiality is not applicable because the content is public, but integrity and availability are both rated moderate.

Here is the same exercise on a few assets. The ratings are judgements, and your context will change them:

| Asset | Confidentiality | Integrity | Availability | Reasoning |
| --- | --- | --- | --- | --- |
| Public marketing website | N/A | Moderate | Moderate | Content is public, but defacement and injected malware damage trust |
| Customer database | High | High | Moderate | A leak or silent edits both do serious harm, and a short outage is survivable |
| Payroll file | High | High | Moderate | Wrong bank details mean stolen salaries as well as exposed pay |
| Personal photo library | Moderate | Low | High | Mostly private, but irreplaceable if lost |
| Water treatment controller | Low | High | High | Few secrets, but wrong readings or a stopped system can hurt people |

Now test yourself. Classify each of these before opening the answer:

{{< accordion mode="collapse" >}}
  {{< accordionItem title="An employee emails the payroll spreadsheet to the wrong colleague" icon="eye" >}}
  **Confidentiality.** Nothing was changed and nothing went down. The
  right data reached the wrong reader.
  {{< /accordionItem >}}
  {{< accordionItem title="An attacker changes the bank account number on a supplier's invoice" icon="bug" >}}
  **Integrity**, and also authenticity, since the message did not really
  come from the supplier. The money arrives somewhere else and everything
  looks normal until someone asks why the supplier has not been paid.
  {{< /accordionItem >}}
  {{< accordionItem title="A faulty update crashes the booking system for six hours" icon="triangle-exclamation" >}}
  **Availability**, with no attacker involved. This is why the triad is
  about outcomes rather than villains.
  {{< /accordionItem >}}
  {{< accordionItem title="Ransomware copies documents out, then encrypts the file server" icon="bomb" >}}
  **Availability and confidentiality.** Encryption takes the files away,
  and the stolen copy lets the attackers threaten to publish them. Many
  modern ransomware incidents hit two properties at once.
  {{< /accordionItem >}}
  {{< accordionItem title="Log entries are deleted to hide an intrusion" icon="file-lines" >}}
  **Integrity**, of the evidence. It also damages accountability, because
  you can no longer say who did what.
  {{< /accordionItem >}}
{{< /accordion >}}

## What the triad leaves out

The triad is a good starting point, not a complete model. Some real concerns fit awkwardly:

- **Authenticity and non-repudiation:** can you prove who did something, and can they deny it later?
- **Privacy:** people's legal and ethical rights over data about them. A company can keep personal data perfectly confidential and still misuse it
- **Safety:** where systems control physical things, failure can hurt people, not just data

In 1998 Donn Parker proposed extending the triad into the [Parkerian hexad][hexad], adding three properties:

| Addition | Meaning | Example |
| --- | --- | --- |
| Possession or control | Who physically holds the data | A stolen laptop with an encrypted drive. Confidentiality survives, but you have still lost control of the device |
| Authenticity | The data really comes from its claimed source | A forged email that passes for the real thing |
| Utility | The data is in a usable form | An encrypted file whose key has been lost: it is available, and useless |

Attackers have their own mirror image, sometimes called the DAD triad:

| Defender's goal | Attacker's goal |
| --- | --- |
| Confidentiality | **D**isclosure |
| Integrity | **A**lteration |
| Availability | **D**enial |

Thinking from the attacker's side often makes the defensive question clearer.

## Four things people get wrong

{{< accordion mode="collapse" >}}
  {{< accordionItem title="Confidentiality just means encryption" icon="lock" >}}
  Encryption is one tool. Access control, classification, careful sharing,
  and secure disposal matter just as much. Encrypted data with a weak or
  shared key is barely protected.
  {{< /accordionItem >}}
  {{< accordionItem title="Availability is an IT problem, not a security problem" icon="cloud" >}}
  Ransomware, denial-of-service attacks, and wiper malware are all attacks
  on availability. Treating uptime as someone else's job leaves a gap
  attackers use.
  {{< /accordionItem >}}
  {{< accordionItem title="Integrity is only about files" icon="file-lines" >}}
  It also covers systems, configurations, software supply chains, and
  records of what happened. An attacker who changes your logs has damaged
  integrity without touching any customer data.
  {{< /accordionItem >}}
  {{< accordionItem title="The goal is to maximise all three" icon="scale-balanced" >}}
  You cannot, as the trade-offs above show. The goal is the right balance
  for this system, chosen deliberately, and written down so that the next
  person knows why.
  {{< /accordionItem >}}
{{< /accordion >}}

## Where to go from here

You have already touched all three in this series. Verifying download checksums in [part four](/tutorials/linux-101/) was integrity. Turning on `ufw` and watching a port go from open to filtered was confidentiality traded against availability. Accepting an SSH host fingerprint was authenticity. The triad is the vocabulary behind decisions you have already been making.

Things to try next:

- Pick one small system you own, such as your email account or your home router, and rate it low, moderate, or high for each property
- Read the next breach story in the news and classify it before reading the analysis
- Skim the worked examples in FIPS 199, which are short and surprisingly readable
- Ask of every control you meet: which property does this protect, and which one does it cost?

The [tutorials](/tutorials/) are the place to practise this on real machines, and the [cheatsheets](/cheatsheet/) are the place to look things up. The next question in the sequence is the one hiding inside the word "right" in "the right people": how a system decides who someone is, and what they are allowed to do. That is authentication and authorisation, and it is where the series goes next.

{{< alert icon="graduation-cap" >}}
This is the fifth entry in the **Cybersecurity Foundations** series. [Part one](/posts/what-is-cybersecurity-really/) introduced the triad, [part two](/posts/how-computer-talk/) covered the network it travels over, [part three](/posts/the-command-line-isnt-scary/) the terminal, and [part four](/tutorials/linux-101/) gave you a lab to practise in. This part returns to the idea all of them rest on.
{{< /alert >}}

Spotted a mistake or something unclear? The [contact page](/contact/) is the fastest way to reach me.

## References

- [NIST FIPS 199: Standards for Security Categorization of Federal Information and Information Systems][fips199]
- [NIST SP 800-12 Rev. 1: An Introduction to Information Security][sp80012]
- [NVD: CVE-2017-5638 (Apache Struts)][cve]
- [Wikipedia: 2017 Equifax data breach][equifax]
- [US Department of Energy: Colonial Pipeline Cyber Incident][doe-colonial]
- [Wikipedia: Colonial Pipeline ransomware attack][wp-colonial]
- [Wikipedia: Stuxnet][stuxnet]
- [CISA: Emergency Directive 21-01, Mitigate SolarWinds Orion Code Compromise][cisa-solarwinds]
- [Wikipedia: Parkerian Hexad][hexad]

[fips199]: https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.199.pdf
[sp80012]: https://csrc.nist.gov/pubs/sp/800/12/r1/final
[cve]: https://nvd.nist.gov/vuln/detail/CVE-2017-5638
[equifax]: https://en.wikipedia.org/wiki/2017_Equifax_data_breach
[doe-colonial]: https://www.energy.gov/ceser/colonial-pipeline-cyber-incident
[wp-colonial]: https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack
[stuxnet]: https://en.wikipedia.org/wiki/Stuxnet
[cisa-solarwinds]: https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise
[hexad]: https://en.wikipedia.org/wiki/Parkerian_Hexad

