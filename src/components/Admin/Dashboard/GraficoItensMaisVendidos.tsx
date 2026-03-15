'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { useEffect, useRef, useState } from 'react'
import type { ItemMaisVendido } from '@/types/dashboard'

type GraficoItensMaisVendidosProps = {
  itensMaisVendidos: ItemMaisVendido[]
}

const QUANTIDADE_MAXIMA_ITENS_EXIBIDOS = 8
const LARGURA_INICIAL_ANTES_DE_MEDIR_EM_PIXELS = 300
const LARGURA_MAXIMA_CONSIDERADA_MOBILE_EM_PIXELS = 600
const MARGEM_ESQUERDA_DESKTOP_EM_PIXELS = 160
const MARGEM_ESQUERDA_MOBILE_EM_PIXELS = 120
const MARGEM_DIREITA_EM_PIXELS = 40
const MARGEM_TOPO_EM_PIXELS = 20
const MARGEM_INFERIOR_EM_PIXELS = 60
const ALTURA_DA_LEGENDA_INTERNA_DO_CHART_EM_PIXELS = 50
const ALTURA_POR_ITEM_EM_PIXELS = 44
const ALTURA_MINIMA_EM_PIXELS = 220

function calcularAlturaDoGrafico(quantidadeDeItens: number): number {
  return Math.max(ALTURA_MINIMA_EM_PIXELS, quantidadeDeItens * ALTURA_POR_ITEM_EM_PIXELS + MARGEM_INFERIOR_EM_PIXELS)
}

export default function GraficoItensMaisVendidos({ itensMaisVendidos }: GraficoItensMaisVendidosProps) {
  const refDoContainerMedido = useRef<HTMLDivElement>(null)
  const [larguraMedidaEmPixels, setLarguraMedidaEmPixels] = useState(LARGURA_INICIAL_ANTES_DE_MEDIR_EM_PIXELS)

  useEffect(() => {
    const elemento = refDoContainerMedido.current
    if (!elemento) return
    const observador = new ResizeObserver(([entrada]) => {
      setLarguraMedidaEmPixels(Math.floor(entrada.contentRect.width))
    })
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  const itensExibidos = itensMaisVendidos.slice(0, QUANTIDADE_MAXIMA_ITENS_EXIBIDOS)
  const alturaDoGrafico = calcularAlturaDoGrafico(itensExibidos.length)

  const estaEmLayoutMobile = larguraMedidaEmPixels < LARGURA_MAXIMA_CONSIDERADA_MOBILE_EM_PIXELS
  const margemEsquerdaResponsiva = estaEmLayoutMobile
    ? MARGEM_ESQUERDA_MOBILE_EM_PIXELS
    : MARGEM_ESQUERDA_DESKTOP_EM_PIXELS

  const topoRealDaAreaDeDesenho = MARGEM_TOPO_EM_PIXELS + ALTURA_DA_LEGENDA_INTERNA_DO_CHART_EM_PIXELS
  const alturaRealDaAreaDeDesenho = alturaDoGrafico - topoRealDaAreaDeDesenho - MARGEM_INFERIOR_EM_PIXELS
  const alturaDeCadaBandaEmPixels = itensExibidos.length > 0 ? alturaRealDaAreaDeDesenho / itensExibidos.length : 0

  return (
    <Card sx={{ borderRadius: 3, border: '2px solid #2E7D3218' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Itens Mais Vendidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por quantidade vendida este mês
          </Typography>
        </Box>

        {itensExibidos.length > 0 ? (
          <Box ref={refDoContainerMedido} sx={{ width: '100%', position: 'relative' }}>
            <BarChart
              width={larguraMedidaEmPixels}
              height={alturaDoGrafico}
              yAxis={[
                {
                  scaleType: 'band',
                  data: itensExibidos.map((item) => item.nome),
                  tickLabelStyle: { fontSize: 0, fill: 'transparent' },
                  disableTicks: true,
                },
              ]}
              series={[
                {
                  data: itensExibidos.map((item) => item.quantidade),
                  label: 'Unidades vendidas',
                  color: '#2E7D32',
                },
              ]}
              layout="horizontal"
              margin={{
                top: MARGEM_TOPO_EM_PIXELS,
                right: MARGEM_DIREITA_EM_PIXELS,
                bottom: MARGEM_INFERIOR_EM_PIXELS,
                left: margemEsquerdaResponsiva,
              }}
              xAxis={[{ label: 'Unidades' }]}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
              style={{
                width: margemEsquerdaResponsiva,
                height: alturaDoGrafico,
              }}
            >
              {itensExibidos.map((item, indice) => {
                const centroDaBandaEmPixels =
                  topoRealDaAreaDeDesenho + indice * alturaDeCadaBandaEmPixels + alturaDeCadaBandaEmPixels / 2

                return (
                  <Box
                    key={item.nome}
                    sx={{
                      position: 'absolute',
                      right: '0.5rem',
                      left: 0,
                      transform: 'translateY(-50%)',
                      fontSize: '0.8125rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'right',
                      color: 'text.primary',
                    }}
                    style={{ top: centroDaBandaEmPixels }}
                  >
                    {item.nome}
                  </Box>
                )
              })}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '13.75rem' }}>
            <Typography color="text.secondary">Nenhum item vendido este mês</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}