'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PixIcon from '@mui/icons-material/Pix'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PaymentIcon from '@mui/icons-material/Payment'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import type { SvgIconComponent } from '@mui/icons-material'
import type { VendaPorFormaPagamento } from '@/types/dashboard'

type ConfiguracaoFormaPagamento = {
  Icone: SvgIconComponent
  cor: string
  label: string
}

const configuracoesFormasPagamento: Record<string, ConfiguracaoFormaPagamento> = {
  dinheiro: { Icone: AttachMoneyIcon, cor: '#2E7D32', label: 'Dinheiro' },
  pix: { Icone: PixIcon, cor: '#00897B', label: 'Pix' },
  'cartão de crédito': { Icone: CreditCardIcon, cor: '#7B1FA2', label: 'Cartão de Crédito' },
  'cartão de débito': { Icone: PaymentIcon, cor: '#1565C0', label: 'Cartão de Débito' },
  'não informado': { Icone: HelpOutlineIcon, cor: '#757575', label: 'Não Informado' },
}

const configuracaoPadrao: ConfiguracaoFormaPagamento = {
  Icone: HelpOutlineIcon,
  cor: '#757575',
  label: 'Outro',
}

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

type CartaoVendasPorFormaPagamentoProps = {
  vendasPorFormaPagamento: VendaPorFormaPagamento[]
}

export default function CartaoVendasPorFormaPagamento({ vendasPorFormaPagamento }: CartaoVendasPorFormaPagamentoProps) {
  const totalVendas = vendasPorFormaPagamento.reduce((soma, v) => soma + v.quantidade, 0)

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '2px solid #9C27B022',
        background: 'linear-gradient(135deg, #fff 0%, #9C27B008 100%)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px #9C27B022' },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Vendas por Forma de Pagamento
          </Typography>
          {totalVendas > 0 && (
            <Typography variant="caption" color="text.secondary">
              {totalVendas} {totalVendas === 1 ? 'venda' : 'vendas'} no total
            </Typography>
          )}
        </Box>

        {vendasPorFormaPagamento.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            Nenhuma venda registrada no mês
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {vendasPorFormaPagamento.map(({ formaPagamento, quantidade, total }) => {
              const { Icone, cor, label } = configuracoesFormasPagamento[formaPagamento] ?? configuracaoPadrao
              const porcentagem = totalVendas > 0 ? Math.round((quantidade / totalVendas) * 100) : 0

              return (
                <Grid key={formaPagamento} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${cor}22`,
                      backgroundColor: `${cor}08`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: `${cor}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icone sx={{ color: cor, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {formatarReais(total)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: cor, lineHeight: 1.2 }}>
                        {quantidade}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {porcentagem}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
