"use client"

import { useState } from "react"
import FilePicker from "../file-picker/FilePicker"
import { CreateBookButton } from "@/ui/components/file-picker/modules/createbutton/CreateDocButton"
import type { FlipBookType } from "../flipbook/type"
import styles from "./modal-flipbook.module.css"

export default function ModalFlipbook() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState<FlipBookType>('magazine')

  return (
    <div className={styles.container}>
      <h2>Novo Flipbook</h2>
      <p>Selecione um arquivo PDF para começar</p>
      
      <div className={styles.pickerSection}>
        <FilePicker file={file} setFile={setFile} />
      </div>

      {file && (
        <div className={styles.options}>
          <label>Estilo de visualização:</label>
          <div className={styles.buttonGroup}>
            <button 
              type="button"
              className={type === 'book' ? styles.active : ''} 
              onClick={() => setType('book')}
            >
              Livro (Capa dura)
            </button>
            <button 
              type="button"
              className={type === 'magazine' ? styles.active : ''} 
              onClick={() => setType('magazine')}
            >
              Revista (Flexível)
            </button>
          </div>

          <div className={styles.footer}>
            {/* O botão de criar que você já tem */}
            <CreateBookButton file={file} />
          </div>
        </div>
      )}
    </div>
  )
}