#!/usr/bin/python3

import json
import cgi
import random


class Rooster:

    def __init__(self, tabel, pos):
        self.druppeltegel = (pos[0], pos[1])
        self.tabel = tabel

    def __str__(self):
        string = ''
        for i in self.tabel:
            string += ' '.join(i) + '\n'
        return string.strip()

    def druppel(self, kleur):
        bekeken = []
        self.kleurburen(self.druppeltegel[0], self.druppeltegel[1], kleur, bekeken, self.tabel[0][0])

        return self

    def kleurburen(self, rij, kolom, kleur, bekeken, originele_kleur):
        self.tabel[rij][kolom] = kleur

        bekeken.append((rij, kolom))

        posities = [(0, -1), (0, 1), (-1, 0), (1, 0)]
        for pos in posities:
            y = rij + pos[0]
            x = kolom + pos[1]
            if (y, x) not in bekeken and 0 <= x < len(self.tabel) and 0 <= y < len(self.tabel) \
                    and (self.tabel[y][x] == kleur or self.tabel[y][x] == originele_kleur):
                self.kleurburen(y, x, kleur, bekeken,originele_kleur)

    def druppels(self, kleuren):
        string = ''
        for i in range(len(kleuren) - 1):
            string = self.druppel(kleuren[i]).rooster
        return self.druppel(kleuren[len(kleuren) - 1])

    def gewonnen(self, kleur):
        teller = 0
        for i in self.tabel:
            for j in i:
                if j == kleur:
                    teller += 1
        return teller == len(self.rooster) - 1


def new_game(size):
    d = dict()
    rooster = []
    temp = []
    kleuren = ["orange", "blue", "purple", "green", "red"]
    for i in range(size ** 2):
        temp.append(kleuren[random.randint(0, 4)])
        if len(temp) == size:
            rooster.append(temp)
            temp = []
    d['board'] = rooster
    d['moves'] = unique_colours(rooster)
    d['score'] = 0
    return d


def do_move(dictionary, kleur, pos):
    rooster = Rooster(dictionary['board'], pos).druppel(kleur)
    dictionary['board'] = rooster.tabel
    dictionary['score'] += 1
    dictionary['moves'] = unique_colours(rooster.tabel)
    if len(dictionary['moves']) == 1:
        dictionary['message'] = "Congratulations you have solved the game in " + str(dictionary['score']) + " steps"
    return dictionary

def unique_colours(rooster):
    kleuren = set()
    for rij in rooster:
        for kleur in rij:
            kleuren.add(kleur)
    return sorted(list(kleuren))

'''
LEES DATA VERSTUURD DOOR JAVASCRIPT IN
'''

data = json.loads(cgi.FieldStorage().getvalue('data'))


'''
BEREKEN TE VERZENDEN DATA
'''

verzenden = dict()

if data['actie'] == 'new_game':
    verzenden = new_game(int(data['size']))
elif data['actie'] == 'do_move':
    verzenden = do_move(data, data['kleur'], tuple(data['pos']))


'''
STUUR CGI ANTWOORD TERUG
'''

print("Content-Type: application/json")
print()

print(json.dumps(verzenden))
