const DIMENSAO_MAXIMA_PX = 800
const QUALIDADE_JPEG = 0.85

export async function redimensionarImagemNoCliente(arquivo: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const urlTemporaria = URL.createObjectURL(arquivo)
    const imagemOriginal = new Image()

    imagemOriginal.onload = () => {
      URL.revokeObjectURL(urlTemporaria)

      const { width, height } = imagemOriginal
      const escala = Math.min(DIMENSAO_MAXIMA_PX / width, DIMENSAO_MAXIMA_PX / height, 1)
      const larguraFinal = Math.round(width * escala)
      const alturaFinal = Math.round(height * escala)

      const canvas = document.createElement('canvas')
      canvas.width = larguraFinal
      canvas.height = alturaFinal

      const contexto = canvas.getContext('2d')
      if (!contexto) {
        reject(new Error('Não foi possível obter contexto do canvas'))
        return
      }

      contexto.drawImage(imagemOriginal, 0, 0, larguraFinal, alturaFinal)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao converter canvas para blob'))
            return
          }
          const nomeArquivoJpg = arquivo.name.replace(/\.[^/.]+$/, '') + '.jpg'
          resolve(new File([blob], nomeArquivoJpg, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        QUALIDADE_JPEG
      )
    }

    imagemOriginal.onerror = () => {
      URL.revokeObjectURL(urlTemporaria)
      reject(new Error('Falha ao carregar imagem para redimensionamento'))
    }

    imagemOriginal.src = urlTemporaria
  })
}
