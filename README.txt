=================================
Sistema di Direcotry 
=================================
Scegliere o creare una  direcory, da utilizzare come directory base.
Per convenzione sarà sempre indicata come
BASEDIR/
In tutte le operazioni faremo riferimento questa directory.
Directory utilizzate nell’applicazione

BASEDIR/ula
  directory dell'applicazione da cui lanciare i comandi

BASEDIR/ula/static
   Contiene tutti gli elementi per la gestione nel browser

BASEDIR/ula/static/cfg
   Contiene tabelle di configurazione

BASEDIR/ula/text
   Contiene i testi originali 

BASEDIR/ula/text_src
   Contiene i testi divisi sistemati
   ed eventualmente divisi in righe
   da utilizzare per la produzione dei dati

BASEDIR/ula/data
   Contiene i dai dei test 
   form: il dizionario del testo
   token: la lista di tutte le parole del testo
   Es.
   pinocchio.txt => pinocchio.form.csv
                     pinocchio.token.csv

=============================
Tabelle di  Configurazione 
============================
- Spostarsi nella dir BASEDIR/ula/static/cfg
- Settare pos.csv 
          msd.csv 
          phon.txt 
- Spostarsi nella dir BASEDIR/ula
- lanciare 
posmsd2json.py
-> salva nella dir BASEDIR/ula/static/cfg
   il file  
   pos_msd.json 
   utilizzato per  POS e MSD

====================================================
Aggiunta di un testo e dei suoi dati 
===================================================
- Posizionarsi nella dir 

BASEDIR/ula

- lanciare 

text_add.py -i path_testo.txt

-> salva nella dir    ./text_src
   il testo pulito 
-> salva nella dir    ./data 
   i dati dei testi
   nome_testo.form.csv
   nome_testo.token.csv
-> aggiorna l'elenco dei testi disponibili nel file 
   text_list.txt 

ATTENZIONE !!
  text_add.py 
  Sovrascrive i dati di una eventuale elaborazione PRECEDENTE
  dello stesso testo.

==============================
Lancio del Server
=============================
- posizionati nella dir BASEDIR/ula
- digitare 
ulaserver.py -p 8080
  si possono usare porte diverse.
  Attenzione la porta 80  può entrare in conflitto  con quella del 
  server di sistema.
  
===========================
Lancio dal browser
==========================  
- digitare l'url:

http://127.0.0.1:8080

Si possono usare porte diverse.
Nel caso sia possibile utilizzare la poeta 80  
si può usare l'url:

http://127.0.0.1  
   
      
========================
Gestione dello Store 
========================
Per ogni postazione dalla quale si lancia il browser
è disponibile una memoria locale denominata Store.
Tale memoria è accessibile solo attraverso il browser,
ma permette la permanenza dei dati fra una sessione e l'altra.
E' molto veloce e garantisce la permanenza dei dati anche
a fronte di una caduta della connessione internet o spegnimento
del server.

Durante il lavoro ogni singola operazione è immediatamente
salvati nello Store.
Questo significa che chiudendo il browser o spegnendo il sistema
i dati sono salvati localmente.
Al successivo collegamento saranno disponibili.
Questo vale sia lavorando in locale (http:/localistico) che 
in remoto.

Save
Per salvare i dati sul server, nella dir BASEDIR/ula/data bisogna 
utilizzare l'opzione Save.
I dati vengono salvati nlla directory BASEDIR/data

Load
Con l'opzione Load vengono letti i dati dal server dalla direcory 
BASEDIR/ula/data.
I dati letti sovrascrivono quelli contenuti nello Store.

ATTENZIONE !! 
Se si vogliono mantenere i dati dello Store bisogna eseguire
Save prima di Load.
Quindi Load server quando si vuole tornare ad una situazione
precedente (quella dell'ultimo salvataggio effettuato con Save)
eliminando le operazioni fatte successivamente memorizzate nello
Store


**** COMANDI OPZIONALI  PER USO PARTICOLARE *******

===============================
Sistemazione  Testi 
==============================
text_cleaner.py 
optional arguments:
  -h, --help  show this help message and exit
  -i          -i <file.txt>
  -o          -o <fileclean.txt>
  -l          -l <line length> -1:not split 0:paragraph >0:rows (default -1)

Sistema puteggiature
rimuove spazi bianche maggiori di 1
elimina spazi ad inizio e fine riga
il parametro l (opzionale):

-1) lascia la separazione originale
0 ) separa per paragrafi
>0) separa per lunghezza riga

-----------------------------------
File testo contiui
-----------------------------------
- posizionarsi nella dir ./text_line
- lannciare

text_cleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> -l 70

il file e sistemato, diviso in righe e traferito

./text_line/name_file.txt => ./text_src/name_file.txt
------------------------------
File testo a righe
------------------------------
- posizionarsi nella dir ./text_lb
- lannciare

text_cleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> 

./text_lb/name_file.txt => ./text_src/name_file.txt

Se si vuole una nuva divisione in rughe
text_cleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> -l 70

./text_lb/name_file.txt => ./text_src/name_file.txt

===============================
Aggiunta di un Testo
===============================
- Posizionarsi sulla dir BASEDIR/ula

- Trasferire il testo nella dir 
  ./text_src

- lanciare 

  text2data.py -i path_testo.txt

-> salva nella dir    BASEDIR/ula/data 
   i dati dei testi
   nome_testo.form.csv
   nome_testo.token.csv
-> aggiorna l'elenco dei testi disponibili nel file 
   text_list.txt 

ATTENZIONE !!
  text2data.py 
  Sovrascrive i dati di una eventuale elaborazione PRECEDENTE
  dello stesso testo.

===============================
Aggiunta di un Testo Semplificata
===============================
add_text.py
sostyituisce 
text_cleaner.py
text2data.p



update copus
aggiorna solo le form per le quali
in text  
lemma!='' and pos !=''
se il campo di corpus non è vuoto lo sovrascrive
stampa la lista dei campi sovrascritti

update text
aggiorna text per tutti i valori di corpus
setta solo i campi vuoti di text

=================================================
CORREZIONE TESTO 
================================================
modifica 
tag:  &u; (token1&u;token2)
=================
token.csv 
modifica il token
token1 => token2
----------------
form.csv 
casi possibil
    a) token1 non esiste nel testo (non dovrebbe esistre)
    b) token1 esiste nel testo     (è giusto che esista)   

    c) token2 non esiste nel testo (dovrebbe esistere)
    d) token2 esiste nel testo     (esiste in un'altra occorrenaza)

azioni su form.csv
   token1 
      se è unico rimuove da form.csv
      altrimenti nessuna azione suform.cssv
   token2
      se ancora non esiste viene agiunto a form.csv
      altrimenti nessuna azione su form.csv

es.
pipo&u;pippo 
pipo è unico
   rimuove pipo
pippo non esiste
   aggiunge pippo

pippo&u;pluto
pippo esiste in altre occoreenze
   nessuna aziione
pluto non esiste
   aggiunge pluto

pippo&u;pluto
pippo esiste in altre occoreenze
   nessuna aziione
pluto gia esiste
   nessuna azione
------------
corpus.csv
riuove token1 e token2
Inutile complicare le cose in quanto il corpus può 
essere aggiornato

=============
cancellazione
tag: &d;   (&d;token)
=============
token.csv 
rimuove token
--------------
azioni su form.csv
   token 
      se è unico rimuove da form.csv
      altrimenti nessuna azione suform.cssv
------------
corpus.csv
riuove token1

===============
aggiunta
tag: &a;  (&a;token)
==============
token.csv 
aggiunge token
-------------
azioni su form.csv
   token
      se ancora non esiste viene agiunto a form.csv
      altrimenti nessuna azione su form.csv

------------
corpus.csv
riuove token1

=============
esempi
============
es. 
errore nel legame
------------------------------------
    spara_lesto => spara lesto 
    &d;spara_lesto &a;spara &a;lesto

azioni su form.csv
    &d;spara_lesto romuove  se ?
    &a;spara       aggiunge se ?
    &a;lesto       aggiunge se ?
-----------------------------------
    spara lesto => spara_lesto
    &dspara &d;lesto &a;spara_lesto
    
azioni su form.csv
    &d;spara       rimuove  se ?
    &d;lesto       rimuove  se ?
    &a;spara_lesto aggiunge se ?
===================================
N.B.
Nel caso di forma != formakey (token disambuguizzato)
Tutte le azioni sono fatte in riferimento a formakey.
nel caso di modifica in token2
vine settata forma=formkey
In altri termini token2 è settato nella forma base
se anche il nuovo token deve essere dismabiguizzato 
l'zione deve esserefatta nell'applicativo.

