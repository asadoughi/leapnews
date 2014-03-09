/*global window */
/*global document */
/*global THREE */

var container;
var camera, scene, renderer, parent;
var targetRotation = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var theta = 45, phi = 60;
var container_tag_cloud = document.createElement('div');


var y_arrow = false, x_arrow = false;
var lastFrameTime = 0;
var counter = 0, counter_max = 10;
function clearArrowIfNoRecentMovement() {
    // 3 frames, zero out the arrow
    if ((Date.now() - lastFrameTime) > 30) {
        if (y_arrow)
            scene.remove(y_arrow);
        if (x_arrow)
            scene.remove(x_arrow);
        render();
    }
}
setInterval(clearArrowIfNoRecentMovement,17); // 60 fps = 17 ms

function get_best_j() {
    var min_distance = Infinity;
    var best_i = visible_row(), best_j = 0;
    var images = parent[best_i].children;
    for (var j = 0; j < images.length; j++) {
        var d = Math.abs((2 * Math.PI - parent[best_i].rotation.y % (2 * Math.PI)) - images[j].rotation.y);
        if (parent[best_i].rotation.y < 0)
            d = Math.abs((Math.abs(parent[best_i].rotation.y) % (2 * Math.PI)) - images[j].rotation.y);
        if (d < min_distance) {
            min_distance = d;
            best_j = j;
        }
    }
    return best_j;
}

function split_text(text, words)
{
    var split = text.split(" ");
    var i = 0;
    var length = split.length;
    var word_count = 0;
    var cur_page = 0;
    var pages = Array();
    pages[0] = Array();
    pages[0] += "<p class='page'>";
    while(i < length)
    {
        if(word_count < words)
        {
            pages[cur_page] += split[i] + " ";
            word_count++;
        }
        else
        {
            pages[cur_page] += "</p>";
            cur_page++;
            pages[cur_page] = Array();
            pages[cur_page] += "<p class='page'>";
            word_count = 0;
        }
        split[i];
        i++;
    }
    return pages;
}


function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10,  2500);
    camera.movementSpeed = 100.0;
    camera.rollSpeed = 0.5;
    camera.position.y = 220;
    camera.position.z = 500;

    scene = new THREE.Scene();
    parent = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
    parent[0].position.y = 320;
    parent[1].position.y = 220;
    parent[2].position.y = 120;
    for (var i = 0; i < parent.length; i++)
         scene.add(parent[i]);

    ////////////////////////////////////////////////////////////////////////
    // Generate 3D Planes in Radius circle
    ////////////////////////////////////////////////////////////////////////
var data = Object();

data[0] = Object();
data[0].type = "article";
data[0].url = "http://www.washingtonpost.com/blogs/the-switch/wp/2014/03/07/snowden-i-raised-nsa-concerns-internally-over-10-times-before-going-rogue/";
data[0].image_url = "http://www.washingtonpost.com/rf/image_606w/2010-2019/WashingtonPost/2013/06/23/Production/Daily/A-Section/Images/NSA_Surveillance_Snowden.JPEG-0ee14.jpg";
data[0].text = "Former National Security Agency contractor Edward Snowden said he repeatedly tried to go through official channels to raise concerns about government snooping programs but that his warnings fell on the deaf ears. In testimony to the European Parliament released Friday morning, Snowden wrote that he reported policy or legal issues related to spying programs to more than 10 officials, but as a contractor he had no legal avenue to pursue further whistleblowing. Asked specifically if he felt like he had exhausted all other avenues before deciding to leak classified information to the public, Snowden responded: Yes. I had reported these clearly problematic programs to more than ten distinct officials, none of whom took any action to address them. As an employee of a private company rather than a direct employee of the US government, I was not protected by US whistleblower laws, and I would not have been protected from retaliation and legal sanction for revealing classified information about lawbreaking in accordance with the recommended process. Snowden worked for the CIA before becoming an NSA contractor for various companies. He was working for Booz Allen Hamilton at an NSA facility in Hawaii at the time he leaked information about government programs to the press. In an August news conference, President Obama said there were 'other avenues' available to someone like Snowden 'whose conscience was stirred and thought that they needed to question government actions.'' Obama pointed to Presidential Policy Directive 19 -- which set up a system for questioning classified government actions under the Office of the Director of National Intelligence. However, as a contractor rather than an government employee or officer, Snowden was outside the protection of this system. 'The result,' Snowden said, 'was that individuals like me were left with no proper channels.' Elsewhere in his testimony, Snowden described the reaction he received when relating his concerns to co-workers and superiors. The responses, he said, fell into two camps. 'The first were well-meaning but hushed warnings not to 'rock the boat,' for fear of the sort of retaliation that befell former NSA whistleblowers like Wiebe, Binney, and Drake.' All three of those men, he notes, were subject to intense scrutiny and the threat of criminal prosecution. 'Everyone in the Intelligence Community is aware of what happens to people who report concerns about unlawful but authorized operations,' he said. The other responses, Snowden said, were similar: suggestions that he 'let the issue be someone else's problem.' Even the highest-ranking officials he told about his concerns could not recall when an official complaint resulted in the shutdown of an unlawful program, he testified, 'but there was a unanimous desire to avoid being associated with such a complaint in any form.' Snowden has claimed that he brought up issues with what he considers unlawful government programs before. The NSA disputes his account, previously telling The Washington Post that, 'after extensive investigation, including interviews with his former NSA supervisors and co-workers, we have not found any evidence to support Mr. Snowden’s contention that he brought these matters to anyone’s attention.' Both Obama and his national security adviser, Susan E. Rice, have said that Snowden should return to the United States and face criminal sanctions for his actions. Snowden was charged with three felonies over the summer and has been living in Russia since fleeing the United States in the wake of the leaks.";
data[0].description = "Snowden: I raised NSA concerns internally over 10 times before going rogue";
data[0].tags = "NSA, Security, Surveillance, Snowden"

data[1] = Object();
data[1].type = "article";
data[1].url = "http://www.hngn.com/articles/26060/20140307/sxsw-interactive-portion-addresses-nsas-prism-program.htm";
data[1].image_url = "http://images.hngn.com/data/images/full/17936/eric-schmidt.jpg?w=600";
data[1].text = "Austin, Texas, is in full-on party mode as South by Southwest kicks off Friday, but the normally lighthearted Interactive portion of the festival is taking a serious turn this year by addressing the National Security Agency's PRISM program head-on, according to Time.com. Reporter Glenn Greenwald, WikiLeaks founder Julian Assange, and NSA whistleblower Edward Snowden will take the stage, Assange and Snowden via a livestream, over the next few days, and even Google executive chairman Eric Schmidt kicked off the festival's first day with deep thoughts on Google's role in the scandal, Time.com reported. SHARE THIS STORY Google chairman Eric Schmidt speaks on the NSA and other topics at South by Southwest on Friday, according to Time.com. 'We were surprised' by the NSA revelations, Schmidt said during a Friday panel at South by Southwest with Jared Cohen, director of Google Ideas, Time.com reported. The agency's work with GCHQ, Britain's surveillance agency, to tap into the fiber-optic networks that carry data between Google's data centers incensed the company, which worked quickly to put the kibosh on the program, called 'Muscular.' 'The very fact that they did this was very suspicious to us,' Schmidt said, Time.com reported. 'The solution to this is to encrypt data at multiple points of source. We now use 2048-bit encryption. We switch the keys at every session. We're pretty sure that any information that's inside of Google is safe from the government's prying eyes, including the U.S. government's.' Schmidt's wariness of the government extends to Snowden, who will also speak at SXSW this weekend, according to Time.com. 'We went to visit with Julian Assange, and both of us felt that who gets to decide what information is public is a pretty fundamental issue in democracy,' Schmidt said, according to Time.com. 'I don't think we want random people leaking large amounts of data. I don't think that serves society.' Schmidt was careful to maintain Google's support of an open Internet free from censorship, Time.com reported. He also criticized countries like Iran that want to lock down the Web and prevent the flow of information, and groups of countries that would band together to participate in the editing of the Internet.";
data[1].description = "SXSW Interactive Portion Addresses NSA's Prism Program";
data[1].tags = "Google,Prism,Security,Surveillance,Snowden,SXSW";

data[2] = Object();
data[2].type = "article";
data[2].url = "http://www.cnn.com/2014/03/07/politics/nsa-surveillance-extend/";
data[2].image_url = "http://www.extremetech.com/wp-content/uploads/2013/12/201372421726917734_20.jpg";
data[2].text = "A federal judge with a secret court has refused the Obama administration's request to extend storage of classified National Security Agency telephone surveillance data beyond the current five-year limit. The Justice Department had argued several pending lawsuits over the bulk data collection program require it to preserve the records for a longer period of time. Judge Reggie Walton, who presides over the Foreign Intelligence Surveillance Court, concluded on Friday the government had not overcome larger privacy concerns. 'The amended procedures would further infringe on the privacy interests of United States persons whose telephone records were acquired in vast numbers and retained by the government to aid in national security investigations,' said Walton, whose main duties are as a Washington-based federal district court judge. 'The great majority of these individuals have never been the subject of investigations by the FBI to protect against international terrorism or clandestine intelligence activities. The government seeks to retain these records, not for national security reasons, but because some of them may be relevant in civil litigation in which the destruction of those very same records is being requested. However, the civil plaintiffs potentially interested in preserving the (telecom) metadata have expressed no desire to acquire the records.' Current surveillance court orders require the National Security Agency or telecommunication companies that gathered the phone records to purge the material within five years. 'The government makes no attempt to explain why it believes the records that are subject to destruction are relevant to the civil cases,' said Walton in his 12-page order. There was no immediate reaction to the order from the Justice Department. Intellgence leaker Edward Snowden last June revealed a secret surveillance court order approving government collection of mass amounts of metadata from telecom giant Verizon and leading Internet companies, including Microsoft, Apple, Google, Yahoo and Facebook. It includes phone numbers called and their location. The exact percentage of metadata being collected has not been revealed publicly. Monitoring of actual conversations requires a separate warrant. President Barack Obama in January cited privacy concerns when announcing that such data should no longer be held by the government, but instead be turned over to the domestic telecoms or a private third party. NSA would still have access to the calls to track potential terror connections. He ordered the intelligence community to formulate such a plan by March 28. The mission of the FISA court, named after the Foreign Intelligence Surveillance Act that created it, is to decide whether to grant certain types of government requests -- wiretapping, data analysis, and other monitoring for 'foreign intelligence purposes' of suspected terrorists and spies operating in the United States. The once-secret approval of collecting bits and pieces of information from electronic communications comes quarterly from judges at the court. To collect the information, the government has to demonstrate to a judge that it is 'relevant' to an international terrorism investigation. There were 1,856 applications in 2012 to the FISA Court for electronic surveillance and physical searches for 'foreign intelligence purposes,' the Justice Department said. The current case is In re: Application of the FBI for an Order Requiring the Production of Tangible Things (BR 14-01).";
data[2].description = "Government can't hold NSA surveillance data longer";
data[2].tags = "NSA,Obama,Surveillance,Data,Security,Rights";

data[3] = Object();
data[3].type = "article";
data[3].url = "http://www.cbsnews.com/news/malaysia-airlines-loses-contact-with-plane-en-route-to-beijing-with-239-aboard/";
data[3].image_url = "http://cbsnews2.cbsistatic.com/hub/i/r/2014/03/08/bdab3fef-e65b-47d2-aae5-2a2aa4983d4f/thumbnail/620x350/7d95ebde61f9f0f4136dc18e43d7b800/malaysia-crash-relative-two.jpg";
data[3].text = "HANOI: Vietnam said its search planes spotted oil slicks in the sea near where a Malaysia Airlines jet carrying 239 people mysteriously vanished on Saturday, in the first hint at the aircraft's possible fate. The announcement came more than 18 hours after flight MH370 slipped off radar screens somewhere between Malaysia's east coast and southern Vietnam, triggering an international search effort. 'Two of our aircraft sighted two oil slicks around 15 to 20 kilometres (10-12 miles) long, running parallel, around 500 metres apart from each other,' the army's deputy chief-of-staff, Vo Van Tuan, told state-run VTV. 'We are not certain where these two oil slicks may have come from so we have sent Vietnamese ships to the area.' Air search operations were halted at nightfall, though ships continued searching, the airline said, adding that no trace of the passenger plane had been found as of late Saturday. 'I think the two oil slicks are very likely linked to the missing plane,' Vice-Admiral Ngo Van Phat, who is helping to direct the search mission, told AFP late Saturday. 'However, we have to check carefully once our rescue boats get access to the area,' he said, adding the boats were around an hour from the site of the slicks and were expected to search a wide expanse of sea in darkness. The twin-engine jet had been flying from Kuala Lumpur to Beijing, where anguished relatives were Saturday evening still desperately waiting for news. The plane had 227 passengers - including 153 Chinese nationals - and 12 crew, according to the airline. An Austrian and an Italian thought to have been on the plane both had had their passports stolen and are safe, officials and family members said. Italian Luigi Maraldi, 37, was on the passenger list, but phoned home from Thailand to let his family know he was safe - and before his father had seen the news. Malaysia Airlines also contacted the Austrian foreign ministry, saying that the name of an Austrian was on the passenger list of the plane, a spokesman for the ministry said. Austrian authorities confirmed the man was safe in Austria. At his house in Kuala Lumpur, Hamid Ramlan, a 56-year-old Malaysian police officer, said his daughter and son-in-law were on the flight for an intended holiday in Beijing. 'My wife is crying. Everyone is sad. My house has become a place of mourning,' he said. 'This is Allah's will. We have to accept it.' MH370 had relayed no distress signal, indications of rough weather, or other signs of trouble, and both Malaysia's national carrier and the Boeing 777-200 model used on the route are known for their solid safety records. 'We are looking at all possibilities but it is too soon to speculate,' Malaysian Prime Minister Najib Razak said, when asked whether terrorism could have been a factor. Authorities would search 'for as long as it takes', he said. The plane's disappearance triggered a search effort involving vessels from several nations with rival maritime claims in the tense South China Sea. China, Vietnam, Malaysia, the Philippines and Singapore threw vessels and aircraft into the effort, while the US Navy confirmed it had agreed to send planes to help the search effort, including a destroyer and a maritime surveillance aircraft. Overlapping claims to the South China Sea, a resource-rich, vital shipping lane, have been a growing source of friction between China and its neighbours. Contact with the aircraft was lost at around 1:30 am Malaysian time (1730 GMT Friday), Malaysian authorities said, about an hour after take-off from Kuala Lumpur International Airport. Initially, authorities had put the last contact time at 2:40 am. The new time suggests the jet disappeared closer to Malaysia than first thought. If the worst is confirmed, it would be only the second fatal crash ever for the widely used Boeing 777. A 777-200 operated by South Korea's Asiana Airlines skidded off the runway in San Francisco last year, killing three people. Malaysia Airlines also has suffered few safety incidents. Its worst occurred in 1977, when 93 passengers and seven crew perished in a hijacking and subsequent crash in southern Malaysia. Indonesia-based aviation analyst Gerry Soejatman said a '24-hour golden window' for search and rescue efforts was closing fast. 'You can't assume that there are no survivors, and if there are any, it is absolutely crucial that they are picked up within a day, or the chances of survival drops significantly,' he said. The 153 Chinese passengers aboard the plane included an infant, while 38 Malaysians and seven Indonesians were aboard. Six Australians, four French nationals, and three Americans including an infant, were also among those listed. A spokeswoman for the US State Department confirmed three Americans were on board the flight while the Dutch Foreign Ministry said it believed one Dutch passenger was on the plane. The pilot had flown for the carrier since 1981, Malaysia Airlines said. The plane was more than 11 years old. 'This news has made us all very worried,' Chinese Foreign Minister Wang Yi said in Beijing. 'We hope every one of the passengers is safe. We are doing all we can to get more details.' The lack of information sparked fury among pained relatives in Beijing. 'They should have told us something before now,' a visibly distressed man in his 30s said at a hotel where passengers' families were asked to gather. 'They are useless,' another young man said of the airline. 'I don't know why they haven't released any information.' A deadly accident would be a huge blow for Malaysia Airlines, which has bled money for years as its struggles to fend off competition from rivals such as fast-growing Malaysia-based AirAsia. Analysts have blamed poor management, government interference, and union resistance to reform for holding back the airline.";
data[3].description = "Malaysia Airlines loses contact with plane en route to Beijing with 239 aboard";
data[3].tags = "Malaysia,Airlines,Disaster,Beijing,Mystery";

data[4] = Object();
data[4].type = "article";
data[4].url = "http://www.reuters.com/article/2014/03/09/us-ukraine-crisis-idUSBREA1Q1E820140309";
data[4].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140309&t=2&i=857510929&w=&fh=&fw=&ll=700&pl=378&r=CBREA2802XC00";
data[4].text = "(Reuters) - Shots were fired in Crimea to warn off an unarmed international team of monitors and at a Ukrainian observation plane, as the standoff between occupying Russian forces and besieged Ukrainian troops intensified. Russia's seizure of the Black Sea peninsula, which began 10 days ago, has so far been bloodless, but its forces have become increasingly aggressive towards Ukrainian troops, who are trapped in bases and have offered no resistance. President Vladimir Putin declared a week ago that Russia had the right to invade Ukraine to protect Russian citizens, and his parliament has voted to change the law to make it easier to annex territory inhabited by Russian speakers. Tempers have grown hotter in the last two days, since the region's pro-Moscow leadership declared it part of Russia and announced a March 16 referendum to confirm it. The worst face-off with Moscow since the Cold War has left the West scrambling for a response. U.S. Secretary of State John Kerry, speaking to Russia's foreign minister for the fourth day in a row, told Sergei Lavrov that annexing Crimea 'would close any available space for diplomacy,' a U.S. official said. President Barack Obama spoke by phone to the leaders of France, Britain and Italy and three ex-Soviet Baltic states that have joined NATO. He assured Latvia, Lithuania and Estonia, which have their own ethnic Russian populations, that the Western military alliance would protect them if necessary. A spokeswoman for the Organization for Security and Cooperation in Europe said no one was hurt when shots were fired to turn back its mission of more than 40 unarmed observers, who have been invited by Kiev but lack permission from Crimea's pro-Russian authorities to cross the isthmus to the peninsula. They had been turned back twice before, but this was the first time shots were fired. Ukraine's border guards said an unarmed observation plane took rifle fire flying 1,000 meters over the regional border. Hackers targeted Kiev's security council with a denial of service attack designed to cripple its computers, the council said. The national news agency was also hit. Russia used similar cyber tactics during its war against Georgia in 2008. Crimea's pro-Moscow authorities have ordered all remaining Ukrainian troop detachments in the province to disarm and surrender, but at several locations they have refused to yield. Moscow denies that the Russian-speaking troops in Crimea are under its command, an assertion Washington dismisses as 'Putin's fiction'. Although they wear no insignia, the troops drive vehicles with Russian military plates. A Reuters reporting team filmed a convoy of hundreds of Russian troops in about 50 troop trucks, accompanied by armored vehicles and ambulances, which pulled into a military base north of Simferopol in broad daylight on Saturday. 'SITUATION HAS CHANGED' The military standoff has remained bloodless, but troops on both sides spoke of increased agitation. 'The situation is changed. Tensions are much higher now. You have to go. You can't film here,' said a Russian soldier carrying a heavy machinegun, his face covered except for his eyes, at a Ukrainian navy base in Novoozernoye. About 100 armed Russians are keeping watch over the Ukrainians at the base, where a Russian ship has been scuttled at the harbor's entrance to keep the Ukrainians from sailing out with three ships of their navy. 'Things are difficult and the atmosphere has got worse. The Russians threaten us when we go and get food supplies and point their guns at us,' said Vadim Filipenko, the Ukrainian deputy commander at the base. A source in Ukraine's defense ministry said it was mobilizing some of its military hardware for a planned exercise, Interfax news agency reported. Ukraine's military, with barely 130,000 troops, would be no match for Russia's. So far Kiev has held back from any action that might provoke a response. Overnight, Russian troops drove a truck into a missile defense post in Sevastopol, the home of both their Black Sea Fleet and the Ukrainian navy, and took control of it. A Reuters reporting team at the scene said no one was hurt. Ukraine's border service said Russian troops had also seized a border guard outpost in the east of the peninsula overnight, kicking the Ukrainian officers and their families out of their apartments in the middle of the night. Polish Foreign Minister Radoslaw Sikorski said on Saturday Poland had evacuated its consulate in Sevastopol due to 'continuing disturbances by Russian forces'. The United States has announced sanctions against individuals it accuses of interfering with Ukrainian territorial integrity, although it has yet to publish the list. Washington has threatened wider action to isolate the Russian economy. The European Union is also considering sanctions, but has so far been more cautious. Any action would be much harder to organize for a 28-nation bloc that takes decisions unanimously, many of whose members depend on Russian natural gas. Ukraine's ambassador to Russia held a 'frank' meeting with a deputy Russian foreign minister, Moscow said, giving no details. Pro-Moscow Crimea leader Sergei Aksyonov said the referendum on union with Russia - due in a week - would not be stopped. It had been called so quickly to avert 'provocation', he said. 'MANY HOTHEADS' 'There are many hotheads who are trying to create a destabilized situation in the autonomous republic of Crimea, and because the life and safety of our citizens is the most valuable thing, we have decided to curtail the duration of the referendum and hold it as soon as possible,' he told Russian television. Aksyonov, whose openly separatist Russian Unity party received just four percent of the vote in Crimea's last parliamentary election, declared himself provincial leader 10 days ago after armed Russians seized the parliament building. Crimean opposition parliamentarians say most lawmakers were barred from the besieged building, both for the vote that installed Aksyonov and another a week later that declared Crimea part of Russia, and the results were falsified. Both votes took place behind closed doors. Crimea has a narrow ethnic Russian majority, but it is far from clear that most residents want to be ruled from Moscow. When last asked in 1991, they voted narrowly for independence along with the rest of Ukraine. Western countries dismiss the upcoming referendum as illegal and likely to be falsified. Many in the region do feel deep hostility to Kiev, and since Aksyonov took power supporters of union with Moscow have controlled the streets, waving Russian flags and chanting 'Rossiya! Rossiya!' Nevertheless, many still quietly speak of their alarm at the Russian takeover: 'With all these soldiers here, it is like we are living in a zoo,' said Tatyana, 41, an ethnic Russian. 'Everyone fully understands this is an occupation.' The region's 2 million population includes more than 250,000 indigenous Tatars, who have returned only since the 1980s after being deported en masse to distant Uzbekistan by Stalin. They are fiercely opposed to Russian annexation. The referendum is 'completely illegitimate. It has no legal basis', Crimean Tatar leader Refat Chubarev told Germany's Suddeutsche Zeitung newspaper. As tempers have hardened, journalists have been beaten by hostile pro-Russian crowds. The Associated Press said armed men had confiscated TV equipment from one of its crews. In addition to the Russian troops, the province is prowled by roving bands of 'self-defense' forces and Cossacks in fur hats armed with whips, bused in from southern Russia. In Crimea, Russian television and the provincial channel controlled by Aksyonov broadcast wildly exaggerated accounts of 'fascists' in control of the streets in Kiev and of plans by Ukraine to ban the Russian language. Ukrainian television and the region's only independent station have been switched off. Putin launched the operation to seize Crimea within days of Ukraine's pro-Russian President Viktor Yanukovich's flight from the country. Yanukovich was toppled after three months of demonstrations against a decision to spurn a free trade deal with the European Union for closer ties with Russia.";
data[4].description = "Warning shots fired to turn monitors back from Crimea";
data[4].tags = "Russia,Ukraine,Crimea,Occupation,Crisis";

data[5] = Object();
data[5].type = "article";
data[5].url = "";
data[5].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140308&t=2&i=856859560&w=580&fh=&fw=&ll=&pl=&r=CBREA270GZ900";
data[5].text = "Republicans, looking for ways to turn November's congressional elections into a referendum on President Barack Obama's signature healthcare law, are trying to portray Obamacare as a danger to Medicare. The aim is to court one of the biggest and most reliable voting blocs in midterm elections, senior citizens and people near retirement, by depicting Republicans as defenders of the federal healthcare program for 42 million seniors. It's an attempt to turn the tables on Democrats, who in the 2012 presidential election attacked Republican Mitt Romney over Republican proposals to overhaul Medicare. 'You'd have to be a blind man in a dark room not to see the political implications of Obamacare in general and now specifically with respect to Medicare,' said Brock McCleary, former polling director for the Republican National Committee. The strategy faces an early test in Tuesday's special U.S. House election in Florida, where analysts say Republican David Jolly and his allies are using Medicare in an 11th-hour effort to create an Obamacare liability for Democrat Alex Sink among older residents who make up 45 percent of the local population. Republicans and Democrats will sift through the election results in search for effective political messages that can be replayed in races including statewide contests in Arkansas, Louisiana and North Carolina that could determine whether Republicans gain control of the Senate. In both the 2010 midterm elections and in the 2012 White House race, Republicans sought to use Medicare as a campaign issue by linking it to Obamacare, but this year Republicans believe they have more ammunition because of the bumpy rollout of the health law that they believe has soured voters on the initiative. The Republican strategy is to tie Obamacare to controversial proposals for two popular Medicare programs: Medicare Advantage, which allows seniors to obtain healthcare benefits through private insurance plans, and Medicare Part D, which covers prescription drugs. Some Democrats also have concerns about the administration's changes to both programs. But Republican officials predict Democrats won't be able to distance themselves from the proposals. 'They're tripping over themselves,' said Andrea Bozek of the National Republican Congressional Committee. 'The public knows the government is to blame and that the government is controlled by Democrats.' The government has long paid more for Medicare Advantage than traditional Medicare, as a way to encourage insurer participation. That allowed Medicare Advantage to grow by offering lower charges and richer benefits. It is expected to cover 29 percent of Medicare beneficiaries this year. But Obama's Patient Protection and Affordable Care Act requires the government contribution to be near parity with traditional Medicare. To that end, officials have proposed a 4 percent pay reduction for insurers in 2015. DARKENING SKIES The final rate won't be set until April. But a new Florida TV ad attacking Sink is already telling seniors what to expect: 'To pay for Obamacare, Washington is forcing seniors to endure deep cuts to Medicare Advantage.' 'Sadly, Alex Sink supports these cuts, sticking with Nancy Pelosi, who wants to keep Obamacare intact,' a narrator says as a washed-out photo of Sink appears alongside images of the House Democratic leader and the Capitol under darkening skies. Analysts say the 30-second ad, sponsored by the Chamber of Commerce, is the first of the 2014 campaign to cite Medicare Advantage. It began running last week. The conservative American Action Forum has since unveiled Medicare Advantage ads targeting Senate Democrats Mark Pryor of Arkansas and Mary Landrieu of Louisiana, as well as House Democrat Nick Rahall of West Virginia, as part of its own $1 million Medicare campaign. Republicans and conservative groups opposed to Obamacare have not aired messages on proposed changes to Medicare Part D, which serves 36 million beneficiaries. But Republican Party officials say it is only a matter of time. Although Part D is less expensive than forecast, the government hopes to limit its future costs by altering coverage for certain drugs, changing pharmacy networks and limiting the number of Part D plans available in any given area. A coalition of groups has expressed concern that seniors could lose coverage for drugs or wind up with fewer choices. The proposals have nothing to do with Obamacare. But Republicans hope to tie them to the law by reminding seniors about the millions of insurance cancellations last year that undermined Obama's claim that people could keep their plans. 'In past elections, the threats were hypothetical. Now, the Affordable Care Act is providing more effective talking points for Republicans because it's now law and the changes are being implemented,' said Andrea Campbell, an expert on seniors and politics at the Massachusetts Institute of Technology. Democrats counter that Obamacare is closing the infamous 'doughnut hole' in Medicare drug coverage that imposes big costs on seniors while reducing current costs for millions. Democratic Party officials also say a recurring Republican claim - that Obamacare cuts $716 billion from Medicare - will boomerang against Republicans who voted for the same policy while approving Wisconsin congressman Paul Ryan's plan to convert Medicare into what critics called a voucher program. 'This is hypocrisy on the part of Republicans,' said Justin Barasky of the Democratic Senatorial Campaign Committee. 'All these ‘cuts' happen under their plan, too.' Frank Orlando of the Polling Institute at Florida's Saint Leo University, said Sink's candidacy could show Democrats have another advantage from data indicating that most voters oppose the repeal of Obamacare - a goal Republicans embrace.";
data[5].description = "Republicans press Medicare attack in congressional elections";
data[5].tags = "Rupublicans,Medicare,Elections,Obamacare,Healthcare";

data[6] = Object();
data[6].type = "article";
data[6].url = "";
data[6].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140307&t=2&i=855989445&w=&fh=&fw=&ll=700&pl=378&r=CBREA260GZU00";
data[6].text = "So many teenage girls turned up dead in a vacant field on the outskirts of Mexico City that people nicknamed it the 'women's dumping ground.' They began showing up in 2006, usually left among piles of garbage. Some were victims of domestic violence, others of drug gangs that have seized control of entire neighborhoods in the gritty town of Ecatepec, northeast of the capital. The lot has since been cleared and declared an ecological reserve. But its grisly past is not forgotten and the killings have only accelerated. Dulce Cristina Payan, 17, was one of the victims. Two years ago, armed men pulled up in a pickup truck and dragged her and her boyfriend away from the porch of her home. He was tossed from the truck within a few blocks but she was taken away and murdered, stabbed repeatedly in the face and stomach. Her father, Pedro Payan, believes the killers belonged to La Familia, a violent drug gang operating in Ecatepec, and that Dulce Cristina was murdered when she resisted rape. 'I think my daughter defended herself, because her nails were broken, and her knuckles were scraped,' sobbed Payan, a former police officer who now sells pirated DVDs from his home to get by. 'She had a strong character.' As drug violence has escalated across Mexico in the past seven years, the rule of law has collapsed in some of the toughest cities and neighborhoods. When that happens, local gangs take control, imposing their will on residents and feeding a culture of extreme violence. Abductions, rapes and murders of women have all soared with more women being killed in Mexico than ever before. Since former President Felipe Calderon launched a military offensive on the drug cartels at the end of 2006, over 85,000 people have died. Between 2007 and 2012, total murders rose 112 percent. Most are young men but the number of women killed shot up 155 percent to 2,764 in 2012, official data shows. Corruption and incompetence are rampant in under-funded police forces across Mexico and the vast majority of murders are never solved. Families routinely complain that police show little interest in the cases of missing women. The parents of Barbara Reyes spent 18 months looking for her after she disappeared in August 2011 from Cuautitlan Izcalli, near Ecatepec. They finally discovered that their daughter's body had been found by authorities within two months of her disappearance and was dumped into a mass grave with other unidentified corpses at a cemetery. 'To this day we really don't know what happened to our daughter,' her father, Alejandro Reyes, said in the living room of their home, sitting next to a photograph of Barbara smiling. 'PANDEMIC' President Enrique Pena Nieto, who took office in December 2012, has pledged to reduce drugs war violence but has not made major changes to the security policies pursued by Calderon. Nor has he done much to tackle murders of women, experts say. Before becoming president, he was governor of the State of Mexico, which encircles much of Mexico City and is home to Ecatepec. In the second half of his 2005-2011 term as governor, the murders of women doubled in the state. 'Violence against women isn't an epidemic, it's a pandemic in Mexico,' said Ana Guezmez, Mexico's representative for United Nations Women, the U.N. entity for gender equality. 'We still don't see it as a central theme of the current administration. You have to send a much stronger message.' Experts say the spike in violence against women is worst in areas hit hard by the drugs war, similar to what happens during civil wars like those in Colombia, Guatemala and El Salvador. Women in conflict zones are often seen as 'territory' to be conquered, and raping and murdering women a way to intimidate rival gangs and the local population. Authorities say victims are getting younger and the attacks more violent. In northeastern Mexico, a major drugs battleground, the number of women slain jumped over 500 percent between 2001 and 2010, according to a study by Mexico's National Commission to Prevent and Eradicate Violence against Women. Guezmez says public violence against women intensifies when crime gangs take control. 'It's associated with rape and displaying the body in public places. A lot more brutal.' The U.S.-Mexico border has long been a dangerous place for women. More than one-fifth of the women killed in Mexico in 2012 were slain in three of the four states neighboring Texas, according to the national statistics agency. Most infamous is Chihuahua, home to Ciudad Juarez, where hundreds of women were murdered or kidnapped in the 1990s. With 22.7 murders for every 100,000 women in 2012, Chihuahua is still Mexico's most dangerous state for women. None of the figures include the many women who have gone missing or those corpses that are so badly mutilated that authorities cannot even identify their gender. About 4,000 women disappeared in Mexico in 2011-2012, mostly in Chihuahua and the State of Mexico, according to the National Observatory Against Femicide. It says many are forced into prostitution, a lucrative business for drug cartels expanding their portfolios. The gangs even prey on women migrants looking to get to the United States. In the desert between Mexicali and Tecate on the U.S. border, rapists are so brazen that they flaunt their crimes by displaying their victims' underwear on trees. Central American migrants trekking to the U.S. border often take contraceptive pills with them because as many as six of 10 are raped passing through Mexico, Amnesty International says. Human rights groups say security forces are often involved in sexual abuse and disappearance of women. IMPUNITY International pressure over the tide of killings persuaded Mexican lawmakers in 2007 to approve new legislation aimed at preventing violence against women. Defining femicide as the 'most extreme form of gender violence,' it created a national body to prevent the killings, and urged judges to sign protective orders for abuse victims. The law also established so-called gender violence alerts, a tool to mobilize national, state and local governments to catch perpetrators and reduce murders. Yet in practice the gender alert has never been activated. Pena Nieto in November pledged a broad response that includes fast-tracking protective orders and making the gender alert more effective. But doubts persist about how effective such measures can be against an overburdened, weak and often corrupt justice system. 'Violence against women is so rife in Mexico that there's no political cost for those who don't deal with the issue,' said a top international expert involved with the matter who didn't want to be identified so he could speak freely. When Payan, the former policeman living in Ecatepec, heard his daughter's screams as she was dragged from their home, he and his neighbors gave chase. Witnesses led them to a house a few miles away, but when they arrived she was already dead. Locals helped relatives track down the killers, but it took months for police to start interviewing witnesses. One suspect was charged with the teen's kidnapping but he was released after posting bail. The other two were jailed for the rapes of other women from the same neighborhood but have yet to be charged in Dulce Cristina's murder. The State of Mexico's attorney general declined to be interviewed over the case. So widespread is the impunity that barely 8 percent of crimes are reported, according to national statistics. Witnesses and victims alike are afraid to testify. Jessica Lucero, 14, was raped in June 2012 near Ecatepec and reported the crime, implicating a neighbor. Within a month, she was raped again and killed. At the 'ecological reserve' in Ecatepec where women used to be dumped, a policeman who can only see out of one eye because of glaucoma stands guard. 'The truth is that against these people there is little we can do,' he said of the gangs. 'We are also helpless.'";
data[6].description = "Violence against women 'pandemic' in Mexico";
data[6].tags = "Mexico,Violence,Women,Mexico_City";

data[7] = Object();
data[7].type = "article";
data[7].url = "";
data[7].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140305&t=2&i=854648233&w=580&fh=&fw=&ll=&pl=&r=CBREA241G3P00";
data[7].text = "You can't spend bitcoins at Amazon.com or to pay your mortgage but, as the Winklevoss twins showed on Wednesday, you can use the digital currency to book a trip into suborbital space. Cameron and Tyler Winklevoss, who famously accused Facebook Inc founder Mark Zuckerberg of stealing their idea, said they used bitcoins to buy tickets for a high-altitude voyage on billionaire Richard Branson's Virgin Galactic commercial spaceflight venture. The brothers, Olympic rowers who earned MBA degrees from Oxford University, have become bitcoin evangelists and investors and are planning to launch a fund to make it easy to trade the digital currency on the stock market. In a blog post, Tyler Winklevoss compared Branson's space endeavor and bitcoin entrepreneurs to major historical figures who changed the way the world was perceived, like Marco Polo, Christopher Columbus, Vasco da Gama and Nicolaus Copernicus. 'It is in this vein that Cameron and I contemplate our tickets into space - as seed capital supporting a new technology that may forever change the way we travel, purchased with a new technology that may forever change the way we transact,' he wrote. Virgin Galactic, a U.S. offshoot of Branson's London-based Virgin Group, is selling rides on its SpaceShipTwo for $250,000. The twins are not the first to sign up for Virgin Galactic using bitcoins, but it is the highest-profile flight booking to date using the currency. Last November, Branson announced that a flight attendant from Hawaii had become the first person to pay for a seat with bitcoins. Bitcoin, a digital currency that is traded on a peer-to-peer network independent of central control, has seen its value soar in the past year as it gains attention from growing numbers of investors, entrepreneurs and regulators. But the virtual currency's struggle for legitimacy has been shaken by recent debacles, including the collapse last week of Tokyo-based Mt. Gox, once the world's dominant bitcoin exchange. Few major retailers have begun accepting payment in bitcoins, and critics say the currency's high volatility makes it unsuitable for everyday transactions. The six-passenger, two-pilot SpaceShipTwo is hauled into the air by a twin-hull carrier jet and then released. The upcoming flights are designed to reach altitudes of more than 65 miles above Earth, high enough to see the curvature of the planet set against the blackness of space.";
data[7].description = "Winklevoss twins use bitcoins to book space trip";
data[7].tags = "BitCoin,Winklevoss,Space_Travel,Digital_Currency";

data[8] = Object();
data[8].type = "article";
data[8].url = "";
data[8].image_url = "http://www.entrepreneur.com/dbimages/article/topimage/1392253109-how-survive-south-by-southwest-sxsw.jpg";
data[8].text = "Entrepreneur is on the ground in Austin for SXSW 2014. Feel as if you're there with us as we share the latest innovations and give you a sneak peek at the launches and ideas that will change how you connect to your world. If you’ve purchased your SXSW Interactive badge, then you and over 30,000 people from around the world will arrive in Austin to participate in one of the largest festivals for new technology, digital trends and entrepreneurship. You’ve likely already started combing through the official programming and sketching out your itinerary. But navigating SXSW goes beyond the calendar of events and can be a daunting task. From my ten years attending the festival and three years covering Interactive for Entrepreneur’s readers, I’ve gleaned a few insights that will help make SXSW one of the highlights of your year. Get your bearings. You’ll be spending most of your time downtown, so know your way around. The Startup Village at the Hilton Austin Downtown is your entrepreneurial capitol building; the Austin Convention Center (across the street) is your Research and Development center; and downtown Austin is your playground. All of SXSW’s entrepreneur-centric programming happens at the Startup Village, and it’s the best spot to network, pitch, and hone your craft. The convention center has the bulk of programming, including all the keynote addresses, new technology, and trade shows. After 6 p.m., when panel sessions are done, the evening activities begin at every bar and venue in the city. Related 5 Startup Naming Rules From SXSW 3 Social Media Startups to Watch From SXSW 2013 Don't Waste Another Networking Opportunity: 6 Tips for Following Up Your most precious commodity is time. With the volume of activities SXSW offers, you’re going to feel like you don’t have enough time for everything. It’s critical to plan ahead, but impossible to fully anticipate each day. New opportunities, scheduling conflicts, and at-capacity sessions will pull you in different directions. Fortunately, SXSW alleviates some of the headache by making every panel available to stream later. You’ll want to minimize hotel trips, so bring a bookbag with everything you need for the day. Keep your device chargers with you because there are outlet stations everywhere, and they’re very popular spots to network. But most importantly, be aware of and evaluate activities that could eat up a large amount of your time. The official Game of Thrones exhibition at the Austin Music Hall might be tempting, but the wait to enter will be several hours. And yes, world-famous Franklin Barbecue does have the best barbecue in America, but the line for that will be even longer. It’s (almost) always sunny, and never stuffy. March is pleasant and sunny in Austin, with average temperatures around 70º during the day and 50º at night: a perfect complement to SXSW’s laid back atmosphere. Unless you’re part of a startup wearing matching t-shirts or a promoter in full costume (they’ll be there), you’ll find that a pair of blue jeans and comfortable walking shoes are perfect. I’d describe the Startup Village as five days of relaxed, business casual Fridays. Also, it always seems to rain one day during Interactive so pack a small umbrella just in case. Networking will not feel like “work.” Networking is what makes SXSW so special. It’s naturally fostered and accelerated at the Startup Village, but you’ll realize quickly that no matter where you are every attendee is eager to talk and listen. Bring whatever you feel is most important to assist you, from business cards to marketing materials. Just remember that whoever you’re talking to is monitoring their own time as well. If you’re trying to sell your great new idea, make sure your elevator pitch is well-honed but, in pure SXSW fashion, be ready to trade the elevator for a happy hour at a dive bar or an energetic line of attendees waiting to discover the next big thing. For any SXSW veterans, what are some tips and tactics you’ve discovered that have helped you navigate Interactive?";
data[8].description = "How to Survive South By Southwest";
data[8].tags = "SXSW,Austin,Guide,Tips,Entrepreneur";

data[9] = Object();
data[9].type = "article";
data[9].url = "";
data[9].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140308&t=2&i=857012846&w=580&fh=&fw=&ll=&pl=&r=CBREA270TCG00";
data[9].text = "Three Arab countries have banned the Hollywood film 'Noah' on religious grounds even before its worldwide premiere and several others are expected to follow suit, a representative of Paramount Pictures told Reuters on Saturday. Islam frowns upon representing holy figures in art and depictions of the Prophet Mohammad in European and North American media have repeatedly sparked deadly protests in Islamic countries over the last decade, fanning cultural tensions with the West. 'Censors for Qatar, Bahrain and the UAE (United Arab Emirates) officially confirmed this week that the film will not release in their countries,' a representative of Paramount Pictures, which produced the $125 million film starring Oscar-winners Russell Crowe and Anthony Hopkins, told Reuters. 'The official statement they offered in confirming this news is because 'it contradicts the teachings of Islam',' the representative said, adding the studio expected a similar ban in Egypt, Jordan and Kuwait. The film will premiere in the United States on March 28. Noah, who in the Bible's Book of Genesis built the ark that saved his family and many pairs of animals from a great flood, is revered by Judaism, Christianity and Islam. An entire chapter in the Koran is devoted to him. Cairo's Al-Azhar, the highest authority of Sunni Islam and a main center of Islamic teaching for over a millennium, issued a fatwa, or religious injunction, against the film on Thursday. 'Al-Azhar ... renews its objection to any act depicting the messengers and prophets of God and the companions of the Prophet (Mohammad), peace be upon him,' it announced in a statement. They 'provoke the feelings of believers ... and are forbidden in Islam and a clear violation of Islamic law,' the fatwa added. Mel Gibson's 2004 film 'The Passion of the Christ' on Jesus's crucifixion was widely screened in the Arab World, despite a flurry of objections by Muslim clerics. A 2012 Arab miniseries 'Omar' on the exploits of a seventh century Muslim ruler and companion of the Prophet Mohammad also managed to defy clerics' objections and air on a Gulf-based satellite television channel. PROTESTS The publication of cartoons of the Prophet Mohammad in a Danish newspaper in 2006 touched off riots in the Middle East, Africa and Asia in which at least 50 people died. A 2012 amateur Youtube video deriding Mohammad produced in California stoked protests throughout the region, and may have contributed to a deadly militant raid in Libya which killed the U.S. ambassador and three other American staff. 'Noah,' whose official video trailer depicts a burly Crowe wielding an axe and computer-animated geysers swamping an army of sinners hoping to board his ark, has also stoked religious controversy at home. Jerry A. Johnson, president of a conservative National Religious Broadcasters (NRB) group, said last month he wanted to 'make sure everyone who sees this impactful film knows this is an imaginative interpretation of Scripture, and not literal.' Paramount responded by agreeing to issue a disclaimer on advertising for the film. 'While artistic license has been taken, we believe that this film is true to the essence, values and integrity of a story that is a cornerstone of faith for millions of people worldwide,' the advisory reads.";
data[9].description = "Hollywood blockbuster 'Noah' faces ban in Arab world";
data[9].tags = "Noah,Hollywood,Banned,Arab,Middle_East";

data[10] = Object();
data[10].type = "article";
data[10].url = "";
data[10].image_url = "http://s1.reutersmedia.net/resources/r/?m=02&d=20140303&t=2&i=853034373&w=&fh=&fw=&ll=700&pl=378&r=CBREA221S1Q00";
data[10].text = "One of the world's leading databases of stolen works of art is offering to help the Cuban government recover dozens of modernist works missing from Havana's National Museum of Fine Arts. The heist was confirmed late last week by officials with Cuba's state-run National Council of Cultural Heritage, which added it was in the process of finishing an inventory of the missing pieces which will be made public. Miami gallery owner Ramon Cernuda, a Cuban-American exile and prominent collector of Cuban art, alerted the Havana museum last month after he became suspicious of 11 works being offered for sale in Miami, including one he purchased. On Friday, Cuban officials confirmed the works, including several by acclaimed Cuban painter Leopoldo Romañach, were part of a larger trove of stolen art, thought to be about 95 pieces in all. The U.S. Federal Bureau of Investigation has begun grand jury proceedings in the case, Cernuda told Reuters on Monday. The FBI said, however, that it could not confirm or deny the existence of an investigation. The disclosure of the theft is a first for the Cuban government since Fidel Castro took power in 1959. In its statement, officials from the National Council of Cultural Heritage stated that the works were cut from their frames while in storage. Most of the missing works were by Cuban artists, it said. The statement indicated the Cuban government would work 'with any proper authorities inside or outside the country' to 'alert museums, galleries, auction houses and others.' In years past, the Cuban government has stayed mum when museum pieces have been put on the market, raising suspicions that the sales had been officially approved in the face of hard economic times. Julian Radcliffe, chairman of the London-based Art Loss Register, said he was in the process to reaching out to Cuban law enforcement and officials at the museum to offer help. The organization is the recognized leader in recovering stolen artworks and it operates the largest private database of reported stolen art - although Radcliffe says they have never worked with Cuba. 'There are some governments who absolutely do report their stolen items, and there are some governments who do not report their items to anyone, ever,' said Radcliffe, adding that Cuba has previously resided in the latter camp. If Cuba decides to take Radcliffe up on his offer, it could bode well for the recovery of the pieces. Having recovered some 2,000 pieces since it was established in 1991, the Art Loss Register monitors on-the-record art transactions worldwide. In past decades, many museums were so embarrassed about losing artworks to theft, that they were often not reported, Radcliffe said. In Cuba's case, some missing museum items in the past included works expropriated from families that went into exile after the 1959 revolution. 'So they are very sensitive about the subject,' he added. Cernuda has since turned over one stolen work to the FBI's art crimes team in Miami along with the documents of the sale. He has also offered to eventually return the piece to Cuba.";
data[10].description = "Art theft experts offer to help Cuba recover missing works";
data[10].tags = "Art_Theif,Cuba,Art,Stolen,Priceless";



data[11] = Object();
data[11].image_url = "http://media.npr.org/assets/img/2014/03/08/nchsaaxcchampionship-f89f4cc957eb8a0306bfa140ad397985d0a8331e-s3-c85.jpg";
data[11].text = "All Things Considered, · When the starting gun sounds at Mount Tabor High School track meets, senior Kayla Montgomery from Winston-Salem, N.C., takes off.The 18-year-old runner sets records, wins state titles, and next week, she's headed to nationals in New York.But when Montgomery runs, her legs go totally numb. She has multiple sclerosis, a disease that causes nerve damage and interference in communication between her brain, spinal cord and legs.When she was 14, she fell during a soccer game. Soon after, Montgomery says, she noticed something else: 'a lack of feeling in my legs and a weird, tingling sensation in my spine.'She told her coach, Patrick Cromwell, about the strange sensations in her legs. He first thought it was normal strain on her muscles, but then Montgomery told her coach she was numb all day.Then, the doctor visits began. After months of tests, doctors finally diagnosed Montgomery with multiple sclerosis.'She was so calm about it,' Cromwell says. 'I honestly just became sick to my stomach and at first I didn't know if she'd ever be on our team again.'Montgomery was determined to keep running.'She said, 'I want to run. I want to run fast. And I don't want you to hold back,' ' Cromwell says. 'This was more than just running fast, this was a journey in trying to keep Kayla one step ahead of MS.'Montgomery has become one of the country's fastest young distance runners. She's ranked 21st in the nation after winning the North Carolina state title in the 3,200 meters in February.'When the race first starts, I feel everything. I can feel my legs moving and I can feel the start of pain and after reaching the first mile marker, I've started to lose most feeling in my legs,' Montgomery says. 'The momentum is kind of what keeps my legs moving and once I stop, they just kind of fall off from underneath me.'Coach Cromwell waits at the finish line at every race to catch Kayla.'With one lap to go, I run across the track and just get ready to catch her,' Cromwell says. 'We catch her just to protect her. We don't want her to brace for a fall and break an arm or collarbone or something.'After her diagnosis, Montgomery feared the day she would no longer be able to run.'For a few years, I was terrified that I might not be able to run tomorrow or the next day,' Montgomery says. 'I kind of decided that that wasn't really helping me and I wasn't happy living like that. So I stopped focusing on the what-ifs, and [started] focusing on what I'm able to do now. Making sure that I make the most of that and take the gift of mobility and use it to the greatest advantage I can.'";
data[11].description = "Catching Kayla: Running One Step Ahead Of Multiple Sclerosis";
data[11].tags = "multiple sclerosis, disease, North Carolina";

data[12] = Object();
data[12].image_url = "http://media.npr.org/assets/img/2014/03/07/kidscash_wide-c2b43733a35228348e5f30532f05b99d2021c06c-s3-c85.jpg";
data[12].text = "All Things Considered, · In 2009, a major corruption scandal dubbed 'Kids for Cash' hit the juvenile justice system of northeast Pennsylvania.Two local judges had been enforcing a zero-tolerance policy for bad behavior by kids. Even minor offenses, like fighting in school or underage drinking, could mean hard time in a juvenile detention facility.Federal prosecutors alleged the judges were actually getting kickbacks from those private detention facilities. They said the judges kept the juvenile detention centers full, and received cash in return.Both judges are now serving time in federal prison, but a new documentary called Kids for Cash is re-examining the case.'I wanted these kids to think that I was the biggest SOB that ever lived,' says former Judge Mark Ciavarella in the film. 'I wanted them to be scared out of their minds when they had to deal with me. Because I was hoping, because of that, they would never put themselves again where they would have to come and deal with me.'Robert May directed the film, which features interviews with some of the kids involved — and both of the judges.'We weren't even going to make the movie unless we could really tell the story from the villain and the victims' side,' May tells NPR's Arun Rath.";
data[12].description = "'Kids For Cash' Captures A Juvenile Justice Scandal From Two Sides";
data[12].tags = "corruption, Pennsylvania, scandal";


data[13] = Object();
data[13].image_url = "http://media.npr.org/assets/img/2014/03/07/istock_000018233795large-9cb07dbacc057f241355f2b9d34f3a4589251baf-s3-c85.jpg";
data[13].text = "Weekend Edition Saturday, · At lunchtime on the North Harris campus of Houston's Lone Star Community College, students stream through the lobby of the student services center, plugged into their headphones or rushing to class.Many walk right past a small information table about the Affordable Care Act.The table is the brainchild of Megan Franks, a health and fitness professor at Lone Star. She knows that young people may be key to the success of Obamacare. The insurance plans need a mix of ages and a mix of healthy and sick people to balance out the costs for everyone — and young people tend to be healthier.But, many young people are confused about how to sign up. Others feel like they can't afford insurance, and don't realize there are subsidies available that could help them. Just getting overworked students to stop and learn about the law, Franks says, is tough.'If you say 'Obamacare,' they know what you're saying. If you say 'Affordable Care Act,' they walk by without any 'ding, ding, ding' (of recognition),' she says. 'So then we throw out the word 'penalty.' Zoom! They've never heard that before. Penalty? That really tends to be a hook more than, 'Gee, you really need health care.' 'Franks says many students at Lone Star are low-income. They often work. Some have families to support. Others struggle to find gas money to even get to class.'I still think so many of them are [in] survival mode: 'Health insurance? Really? You know, I've got to get to work,' ' she says.She could be talking about Adan Castillo. He's 19 and hoping for a career in law enforcement, or maybe the Marines. In addition to his classes, he also works.Castillo actually used to be insured. He paid his parents $55 a month to keep him on their health plan.But he says it just felt like throwing money away.'I just stopped giving it to them,' he says. 'There are other important things I have to do, like paying for my college books, classes ... gas. Gas is expensive nowadays.'But Adan's girlfriend, Leslie Gonzalez, says insurance is important. She's an accounting student.'Well, he needs it,' Gonzalez says. 'Because what if – let's say he doesn't have it right now and he gets in an accident. He's going to have to pay everything out of pocket, and what if he doesn't have it?'Gonzalez works part time as a bank teller. She says she will sign up for insurance at work as soon as she is eligible.The stereotype about young people is that they think they're 'invincible,' that they don't need insurance because they're young and nothing bad will happen to them for years.But most young adults don't actually think that way.Two recent surveys, one from the Kaiser Family Foundation and one from the Commonwealth Fund, reveal that cost is the real issue. (Kaiser Health News is an editorially independent program of the Kaiser Family Foundation.)Young people think health insurance is expensive, and they assume they can't afford it. Often, they simply don't know about the subsidized plans offered under the law, or how to get them.Taylor Castille is a nursing student in her second year at Lone Star. She has logged on to HealthCare.gov, but says her first visit didn't go very well.'I finally got on the website the other day,' Castille explains, 'and it was kind of confusing to me because I didn't understand ... if I would have to pay, what would I pay, what I'm not paying. It was really confusing, and I got stressed out all over again just looking at that. So I just left the site and didn't even bother to go back.'Castille still wants health coverage. Last fall she suffered a series of fainting spells and seizures. After a few visits to a hospital emergency room, she now has $30,000 in medical debt. And she still doesn't have a diagnosis.'I have all this debt — and I'm 21,' she says. 'I haven't bought a car, I haven't done anything. I don't have the debt because I was being irresponsible. I have the debt because I was sick. And I couldn't control that, so now I'm stuck with that.'Castille later visited the campus information table and got a flier on how to sign up for a health plan.So far, only about 25 percent of adults who have signed up are younger than 34. The federal government is hoping to nudge that proportion closer to 40 percent.The deadline to enroll — for all ages — is March 31.";
data[13].description = "Reaching The Young And Uninsured On A Texas Campus";
data[13].tags = "health insurance, Texas, uninsured, youth";

data[14] = Object();
data[14].image_url = "http://media.npr.org/assets/img/2014/03/08/ap296349541015_custom-86f350ac05d1d2fe3c5c49252237b004e4cde4c9-s40-c85.jpg";
data[14].text = "NPR.org, March 8, 2014 · Clocks will be set ahead by one hour tonight in much of America, as 2 a.m. will become 3 a.m. early Sunday, March 9. Among the states, only Hawaii and much of Arizona will keep their clocks set to Standard Time. Most of Europe won't begin what it calls 'Summer Time' until March 30.American territories that don't observe Daylight Saving Time include Puerto Rico, American Samoa, Guam and the U.S. Virgin Islands. The Navajo Indian Reservation in Arizona changes its clocks with the rest of the continental U.S.If you feel the time change seems to be coming earlier these days, you're not wrong. For years, the day to 'spring forward' was the first Sunday in April; it was changed in 2007 to the second Sunday in March. That change also extended Daylight Saving Time an extra week into November. For 2014, DST will run until Nov. 2.As Kim Ode notes in a story for the Minnesota Star Tribune, 'Standard time now lasts a mere four months, making it anything but the standard.'Daylight Saving is meant to adjust our clocks to match the times people are active with daylight hours, the National Institute for Standards and Technology says. But the agency admits that there's room for debate:'Proponents feel that this saves energy because in the spring and summer months more people may be outside in the evening and not using energy at home. There are, however, ongoing debates about how much energy is saved. The California Energy Commission has additional information about DST and links to several studies about its effects on energy consumption.'From NASA comes a historic view, saying that 'Benjamin Franklin is credited with the concept of Daylight Saving Time.'But hold on a minute, the Department of Energy says:'Sometimes credited with inventing Daylight Saving Time, Benjamin Franklin — the man who is known for the saying 'Early to bed and early to rise ...' — did not actually suggest a change in time. Franklin's connection to Daylight Saving Time comes from his 1784 satirical letter to the editor in the Journal de Paris in which he proposed that Parisians could save money on candles by waking up before their normal time of noon.'A 2005 book on the topic, Seize the Daylight, gave a bit more weight to Franklin's letter, noting that 'he had obviously given the subject much thought. In fact, the germ of his idea can be traced back many years' — to 1757, as author David Prerau wrote in an excerpt published by NPR back then. But Prerau also noted that Daylight Savings' origin story is 'curious and contentious.'The Department of Energy says Germany became the first nation to use Daylight Saving Time back in 1916, to save resources during World War I. The U.S. soon followed suit, but the country didn't adopt a standard approach until 1966.";
data[14].description = "Daylight Saving Time: Set Your Clocks Ahead Tonight";
data[14].tags = "Time, Clocks, Business, Daylight Savings";



/*
data[14] = Object();
data[14].image_url = "";
data[14].text = "";
data[14].description = "";
data[14].tags = "";
*/


    var camSize = 100;
    var startAngle = 0;
    var circleRadius = 230;

    var mpi = Math.PI / 180;
    var startRadians = startAngle * mpi;
    var totalSpheres = 15;
    var incrementAngle = 360 / totalSpheres;
    var incrementRadians = incrementAngle * mpi;

    for (var i = 0; i < totalSpheres; i++) {
        var f = i;
        var xp = Math.sin(startRadians) * circleRadius;
        var zp = Math.cos(startRadians) * circleRadius;
        var planObj = new THREE.Mesh(
            new THREE.PlaneGeometry(camSize, 0.95*camSize),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(data[f].image_url),
                doubleSided: false,
                wireframe: false,
                overdraw: true
            }));
        planObj.name = data[f].image_url
        planObj.title = data[f].description
        planObj.gallery = split_text(data[f].text, 50)
        planObj.tags = render_tags(data[f].tags);

        planObj.position.x = xp;
        planObj.position.z = zp;
        planObj.rotation.y = i * incrementAngle * mpi;
        startRadians += incrementRadians;
        parent[i%3].add(planObj);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColorHex(0xF8F8F8, 0.9);
    container.appendChild(renderer.domElement);

    container.appendChild(container_tag_cloud);
    container_tag_cloud.setAttribute("style", "top:50%;left:80%;z-index:10;position:absolute");
}

function render_tags(tags)
{
    var split = tags.split(",");
    var i = 0;
    var length = split.length;
    var html = Array();
    html += "<div id='tags_container'>";
    html += "<ul id='tags'>";
    while(i < length)
    {

        html += "<li class='tag'>" + split[i] + "</li>";
        i++;
    }
    html += "</div>";
    html += "</ul>";
    return html;
}



function animate() {
    requestAnimationFrame(animate);
    render();
}

function visible_row() {
    var min_distance = Math.abs(parent[0].position.y - camera.position.y);
    var distance_i = 0;
    for (var i = 1; i < parent.length; i++) {
        var d = Math.abs(parent[i].position.y - camera.position.y);
        if (d < min_distance) {
            min_distance = d;
            distance_i = i;
        }
    }
    return distance_i;
}

var last_best_i = false, last_best_j = false;
function render() {
    distance_i = visible_row();
    parent[distance_i].rotation.y += (targetRotation - parent[distance_i].rotation.y) * 0.05;

    var best_i = visible_row();
    var best_j = get_best_j();
    if (last_best_i && last_best_j) {
        if (last_best_i != best_i || last_best_j != best_j)
            container_tag_cloud.innerHTML = parent[best_i].children[best_j].tags;
    } else {
        container_tag_cloud.innerHTML = parent[best_i].children[best_j].tags;
    }
    last_best_i = best_i;
    last_best_j = best_j;

    renderer.render(scene, camera);
}

function leapMain() {
    var frameCount = 3;
    var controller = new Leap.Controller({enableGestures: true});
    var x_threshold = 30, y_threshold = 60;
    var in_gallery = false;
    controller.on('frame', function(frameInstance) {
        lastFrameTime = Date.now();
        if (in_gallery) {
            for (var i = 0; i < frameInstance.gestures.length; i++) {
                if (frameInstance.gestures[i].type == "swipe") {
                    $.fancybox.close();
                    in_gallery = false;
                    break;
                } else if (frameInstance.gestures[i].type == "circle" && frameInstance.gestures[i].state == "stop") {
                    if (frameInstance.gestures[i].normal[2] <= 0)
                        $.fancybox.next();
                    else
                        $.fancybox.prev();
                }
            }
        } else if (frameInstance.hands.length > 0) {
            for (var i = 0; i < frameInstance.hands.length; i++) {
                if (frameInstance.hands[i].pointables.length == 1) {

                    // figure out which image i'm looking at
                    var min_distance = Infinity;
                    var best_i = visible_row(), best_j = 0;
                    var images = parent[best_i].children;
                    for (var j = 0; j < images.length; j++) {
                        var d = Math.abs((2 * Math.PI - parent[best_i].rotation.y % (2 * Math.PI)) - images[j].rotation.y);
                        if (parent[best_i].rotation.y < 0)
                            d = Math.abs((Math.abs(parent[best_i].rotation.y) % (2 * Math.PI)) - images[j].rotation.y);
                        if (d < min_distance) {
                            min_distance = d;
                            best_j = j;
                        }
                        if (frameCount % 250 == 1)
                            console.log(parent[best_i].rotation.y + " -- " + j + " -- " + images[j].rotation.y + " -- " + images[j].name);
                    }
                    if (frameCount % 250 == 1) {
                        console.log("bang! " + best_i + " " + best_j + " " + parent[best_i].children[best_j].name);
                        var l = [
                            {
                                href : parent[best_i].children[best_j].name,
                                title : parent[best_i].children[best_j].title,
                            }
                        ];
                        var gallery = parent[best_i].children[best_j].gallery;
                        for (var x = 0; x < gallery.length; x++)
                            l.push({content: gallery[x]});
                        in_gallery = true;
                        $.fancybox.open(l, {padding : 0});
                    }
                    frameCount += 1;
                }

                // Looking for open hand preferably, not pointer index
                if (frameInstance.hands[i].pointables.length < 3)
                    continue;

                // X-axis - left/right
                var x_direction = frameInstance.hands[i].palmPosition[0];

                var ARROW_X_OFFSET = 375;
                var X_ARROW_SIZE = 50;
                var x_origin = false, x_terminus = false;

                var percentage = Math.abs(x_direction)/150;
                if (x_direction > x_threshold) {
                    targetRotation += 0.02 * percentage;

                    X_ARROW_SIZE *= percentage;
                    x_origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y,
                                                 0);
                    x_terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET + X_ARROW_SIZE,
                                                   camera.position.y,
                                                   0);
                } else if (x_direction < -x_threshold) {
                    targetRotation -= 0.02 * percentage;

                    X_ARROW_SIZE *= percentage;
                    x_origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y,
                                                 0);
                    x_terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET - X_ARROW_SIZE,
                                                   camera.position.y,
                                                   0);
                }

                if (x_arrow)
                    scene.remove(x_arrow);
                if (x_origin && x_terminus) {
                    var direction = new THREE.Vector3().subVectors(x_terminus, x_origin).normalize();
                    x_arrow = new THREE.ArrowHelper(direction, x_origin, X_ARROW_SIZE, 0xaa0000, 20, 20);
                    scene.add(x_arrow);
                }


                // Y-axis - up/down
                var origin = false, terminus = false;
                var y_direction = (frameInstance.hands[i].palmPosition[1]-175);
                var Y_ARROW_SIZE = 100;
                if (y_direction < -y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);

                    Y_ARROW_SIZE *= -y_direction/150;
                    origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                               camera.position.y,
                                               0);
                    terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y - Y_ARROW_SIZE,
                                                 0);
                } else if (y_direction > y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);

                    Y_ARROW_SIZE *= y_direction/150;
                    origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                               camera.position.y,
                                               0);
                    terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y + Y_ARROW_SIZE,
                                                 0);
                }

                // adding arrow
                if (y_arrow)
                    scene.remove(y_arrow);
                if (origin && terminus) {
                    var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
                    y_arrow = new THREE.ArrowHelper(direction, origin, Y_ARROW_SIZE, 0xaa0000, 20, 20);
                    scene.add(y_arrow);
                }

                // Z-axis - zoom
                // camera.fov *= (1 + frameInstance.hands[i].palmPosition[2]/50000);
                // camera.updateProjectionMatrix();

                render();
            }
        }
    });
    controller.connect();
}

init();
leapMain();
animate();
