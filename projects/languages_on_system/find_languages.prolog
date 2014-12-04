:- use_module([ library(list_util),
                library(lambda)
              ]).

% NOTE:
%
%   1.  This is a flawed toy. It reports some false positives (becase, of langauges)
%       like Icon that have words appearing in other contexts. It's an exercise piece.
%
%   2.  I have made some edits to this file since the last time I tested it on a run.
%       That might have broken it.


%% Description of program
%
%   This program takes a file with strings sepparated by lines and pipes
%   in the package information from Ubuntu systems.
%   
%   It writes out a list of packages which contain the strings from the
%   first file, grouped under each respective string.

main :-
    language_packages(Packages),
    write_language_packages(Packages, '/home/um/public_html/languages_on_system.txt'),
    !.


%% language_packages(-LanguagePackages:dict)
%
%   Gathers data from system, parses and structures it in a dict
%   
language_packages(LanguagePackages) :-
    languages(Langs),
    installed_packages(Packs),
    foldl(language_packer, Langs, Packs/_{}, _/LanguagePackages).

%% write_language_packages(+LangPacks:dict, +Stream)
%
%   Outputs formatted list of language packages given a dict
%   and a file.
%   
write_language_packages(LangPacks, File) :-
    open(File, write, Stream),
    foreach( Packages = LangPacks.Language,
             ( format(Stream, '~w :~n', [Language]),
               maplist(format(Stream, '---- ~w~n'), Packages),
               write(Stream, '\n')
             )
           ),
    close(Stream).


/* FETCHING INFORMATION FROM THE SYSTEM */

%% pipes in data from unix shell
%
%   (The arrow syntax is supplied by my module 'composer'. It is similar to function position.)
%   
installed_packages(Records) :-
    Records =: maplist(record_of_words) <- maplist(words_of_string) <- drop_n(5) <- lines_of_file <- *pipe('dpkg -l'). 

%% depends upon the existence of a text file named 'list_of_languages.txt'
%% with one language name per line
languages(Languages) :-
    Languages =: inv(maplist(atom_string)) <- lines_of_file <- *'list_of_languages.txt'.


/* PROCESSING THE INFORMATION FETCHED */

%% checks wether or not the strings in package contain a langauge name
language_pack(LangaugeName, Pack) :-
    member(Word, Pack),
    same_word(Word, LangaugeName).

%% language_packer(+Lang:string, +Packs:list(string)/+OldDict:dict, -RemnantPacks:list(string)/-NewDict:dict)
%
%   Designed to be used with foldl.
%   Lang is a string or atom naming a language.
%   Packs is a list of strings describing an installed package.
%   OldDict is a dict containing Lang:list(Packs)
%   
language_packer(Lang, Packs/OldDict, RemnantPacks/NewDict) :-
    partition(language_pack(Lang), Packs, LangPacks, RemnantPacks),
    ( LangPacks == []
    -> NewDict = OldDict
    ;  maplist(\L^A^atomics_to_string(L,' ',A), LangPacks, LangPacksAtomized), % funky business with ^ is from library(lambda)
       NewDict = OldDict.put(Lang, LangPacksAtomized)
    ).

% processing strings and streams

lines_of_file(File, Lines) :-
    Lines =: lines_of_string <- string_of_stream <-(Stream)-- stream_of_file <- *File,
    close(Stream).

stream_of_file(File, Stream)     :- open(File, read, Stream).
string_of_stream(Stream, String) :- read_string(Stream, _, String).
lines_of_string(String, Lines)   :- split_string(String, "\n", "\n", Lines).
words_of_string(String, Words)   :- split_string(String, " ", " ", Words).
record_of_words([_,N,_,_|Rest],  % just dropping the 1st, 3rd, and 4th elements
                [N, ":" |Rest]). % separate the name and descripton with a colon.



/* AUXILLIARY PREDICATES: */

drop_n(N, In, Out) :-
    length(Drop, N),
    append(Drop, Out, In).

%% comparing words

same_word(A, B) :-
    LowerA =: string_lower <- strip_punctuation <- *A,
    LowerB =: string_lower <- strip_punctuation <- *B,
    LowerA = LowerB.
strip_punctuation(String, Stripped) :-
    [Stripped] =: split_string(String, "", "!,\"#$%&' ()*+-./:;<=>?@[\\]^_`{|}~ ¡¢£¤¥¦§¨©«¬­®¯°±²³´¶·¸¹»¼½¾¿×÷").

