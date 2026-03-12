import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrarImagensBase64ParaStorage() {
  const { data: itens, error: erroListagem } = await supabase
    .from('itens_catalogo')
    .select('id, nome, imagem_url')
    .like('imagem_url', 'data:%')

  if (erroListagem) {
    console.error('Erro ao buscar itens:', erroListagem.message)
    process.exit(1)
  }

  if (!itens || itens.length === 0) {
    console.log('Nenhum item com imagem base64 encontrado.')
    return
  }

  console.log(`Encontrados ${itens.length} itens com imagem base64 para migrar.\n`)

  let migradosComSucesso = 0
  let migradosComFalha = 0

  for (const item of itens) {
    try {
      const matchBase64 = item.imagem_url.match(/^data:([^;]+);base64,(.+)$/)
      if (!matchBase64) {
        console.error(`[FALHA] ${item.nome} — formato base64 inválido`)
        migradosComFalha++
        continue
      }

      const buffer = Buffer.from(matchBase64[2], 'base64')
      const caminho = `itens/${crypto.randomUUID()}.jpg`

      const { error: erroUpload } = await supabase.storage
        .from('imagens-catalogo')
        .upload(caminho, buffer, { contentType: 'image/jpeg', upsert: false })

      if (erroUpload) throw new Error(erroUpload.message)

      const { data: dadosUrl } = supabase.storage
        .from('imagens-catalogo')
        .getPublicUrl(caminho)

      const { error: erroAtualizacao } = await supabase
        .from('itens_catalogo')
        .update({ imagem_url: dadosUrl.publicUrl })
        .eq('id', item.id)

      if (erroAtualizacao) throw new Error(erroAtualizacao.message)

      console.log(`[OK] ${item.nome} → ${dadosUrl.publicUrl}`)
      migradosComSucesso++
    } catch (erro) {
      console.error(`[FALHA] ${item.nome} —`, (erro as Error).message)
      migradosComFalha++
    }
  }

  console.log(`\nResumo: ${migradosComSucesso} migrados com sucesso, ${migradosComFalha} com falha.`)
}

migrarImagensBase64ParaStorage()
