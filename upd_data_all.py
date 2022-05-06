#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from ulalib.ualog import Log
from ulalib.update_data import UpdateData
from ulalib.ula_setting import TEXT_SRC_DIR, CORPUS_NAME
from pdb import set_trace

__date__ = "09-04-2022"
__version__ = "0.1.0"
__author__ = "Marta Materni"


def update_all_text():
    """
    aggiorna tutti i
    data/*.form.csv
    utilizzando:
    data/text_lsit.txt
    data_corpus/corpus.form.csv
    """
    try:
        #set_trace()
        path_err = "log/upd_all_text.ERR.log"
        logerr = Log("w").open(path_err, 1).log
        upd_data=UpdateData()
        upd_data.update_all_text_forms()
    except Exception as e:
        msg = f'ERROR upd_all_text \n{e}'
        logerr(msg)
        sys.exit()


if __name__ == "__main__":
   update_all_text()