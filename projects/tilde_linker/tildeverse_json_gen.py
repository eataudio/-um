#!/usr/bin/python3


# This is copied verbatim from ~sanqui. I hope to study, and maybe change it.

cake="""#                 , 
#                (_) 
#                |-|
#                | |
#                | |
#               .| |. 
#              |'---'|
#              |~  ~~|
#          .-@'|  ~  |'@-.
#         (@    '---'    @)
#         |'-@..__@__..@-'|
#      () |~  ~ ~ ~     ~ | ()
#     .||'| ~() ~   ~ ()~ |'||.
#    ( || @'-||.__~__.||-'@ || )
#    |'-.._  ||   @   ||  _..-'|
#    |~ ~  '''---------'''  ~  |
#    |  ~  ~  H A P P Y ~  ~  ~|
#    | ~     ~ 1 0 0 0 ~   ~ ~ |
#jrei '-.._  T I L D E S  _..-'
#          '''---------'''
"""

import datetime
import json
import requests
from bs4 import BeautifulSoup as BS
from random import shuffle

tildes = requests.get('http://tilde.club/~pfhawkins/othertildes.json').json()
tildes['tilde club'] = "http://tilde.club/"
tildes['retronet'] = "http://retronet.net/users.html"
tildes['tilde center'] = "http://tilde.center/"
tildes['palvelin club'] = "http://palvelin.club/users.html"

users = []
timeouts = []

for tilde in sorted(tildes.values()):
	print("Getting "+tilde)
	#if not tilde.endswith('/'):
	#	tilde += '/'
	new = 0
	try:
		r = requests.get(tilde, timeout=15).text
	except requests.exceptions.Timeout:
		timeouts.append(tilde)
		continue
	if tilde=="http://palvelin.club/users.html": tilde = "http://palvelin.club/"
	homepage = BS(r)
	l = homepage.find('ol') or homepage.find('ul') or homepage.find(id_='userlist')
	if tilde=="http://squiggle.city/": l = None
	if l:
		for li in l.find_all('li'):
			if li.text=="Free shell hosting!": break
			li = li.a or li
			url = (tilde+"/" if not tilde.endswith('/') else tilde)+"~"+li.text.lstrip('~')
			if li.has_attr('href') and li['href'].startswith('http'): url = li['href']
			users.append(url.rstrip('/'))
			new += 1
	if not l or new == 0:
		for a in homepage.find_all('a'):
			if a.text.startswith('~'):
				users.append(tilde+'~'+a.text.lstrip('~'))
				new += 1
	print("Got {} users.".format(new))

for line in requests.get("https://bleepbloop.club/~storm/users.txt").text.split('\n'):
	users.append(line)

users = set(users)

# with open('/home/sanqui/public_html/tildeverse_users.txt', 'w') as f:
# 	f.write("# Generated at {}\n".format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") ) )
# 	f.write("# {} users total across {} tildeboxes.\n".format(len(users), len(tildes)))
# 	if len(users) >= 1000:
# 		f.write(cake)
# 	for timeout in timeouts:
# 		f.write("# timeout 15s: {}\n".format(timeout))
# 	for user in sorted(users):
# 		f.write(user+'\n')
