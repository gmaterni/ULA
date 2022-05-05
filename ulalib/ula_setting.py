#!/usr/bin/env python3
# -*- coding: utf-8 -*-

TEXT_DATA_DIR = "./data"
TEXT_DATA_BACK_DIR = "data_back"
TEXT_SRC_DIR = "./text_src"
NAME_TEXT_LIST = './data/text_list.txt'

CORPUS_NAME = "corpus.form.csv"
CORPUS_DATA_DIR = "./data_corpus"
CORPUS_DATA_BACK_DIR = "data_corpus_back"

TMP_DIR = "./tmp"

# ENCODING = 'ISO-8859-1'
ENCODING = 'utf-8'
PUNCTS = ',.;::?!^~()[]{}<>=+*#@£&%/\\«»“"\'-`‘’'
# APOSTROFO, TRATTINO, PUNTINO gestiti con i token
# NOPUNTS="’-·"
PUNCTS = ',.;::?!^~()[]{}<>=+*#@£&%/\\«»“"\'`‘'

# attacca a
# sinistra# l’altra => l’ altra
# destra#   de·l destrucion => de ·l destrucion
#           destruci-on => destruci -on
BL = ' '
PTR_CHS = [r"\s*[’]\s*",
           r"\s*[-]\s*",
           r"\s*[·]\s*"]
CHS_LR = ['’'+BL,
          BL+'-',
          BL+'·']
