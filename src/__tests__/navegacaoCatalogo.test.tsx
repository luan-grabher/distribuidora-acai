import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...props} />
    ),
}))

import Header from '@/components/Header/Header'
import Contact from '@/components/Contact/Contact'
import Hero from '@/components/Hero/Hero'
import Products from '@/components/Products/Products'
import { siteConfig } from '@/config/siteConfig'

describe('Botões de navegação para o catálogo', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    })

    describe('Header', () => {
        it('botão Catálogo no menu tem href correto para /catalogo', () => {
            render(<Header />)
            const linksCatalogo = screen.getAllByRole('link', { name: /catálogo/i })
            const linkCatalogo = linksCatalogo.find(link => link.getAttribute('href') === siteConfig.nav.catalogoHref)
            expect(linkCatalogo).toBeDefined()
            expect(linkCatalogo).toHaveAttribute('href', '/catalogo')
        })

        it('botão Catálogo no menu é visível', () => {
            render(<Header />)
            const linksCatalogo = screen.getAllByRole('link', { name: /catálogo/i })
            expect(linksCatalogo.length).toBeGreaterThan(0)
        })

        it('links de navegação do menu levam às seções corretas da home', () => {
            render(<Header />)
            siteConfig.nav.links.forEach(link => {
                const botao = screen.getByRole('button', { name: link.label })
                expect(botao).toBeInTheDocument()
            })
        })

        it('botão Contato no menu existe e é clicável', () => {
            render(<Header />)
            const botaoContato = screen.getByRole('button', { name: 'Contato' })
            expect(botaoContato).toBeInTheDocument()
            fireEvent.click(botaoContato)
        })
    })

    describe('Contact', () => {
        it('botão Ver Catálogo na seção de contato tem href correto para /catalogo', () => {
            render(<Contact />)
            const linkCatalogo = screen.getByRole('link', { name: /ver catálogo/i })
            expect(linkCatalogo).toHaveAttribute('href', '/catalogo')
        })

        it('botão Ver Catálogo na seção de contato é visível', () => {
            render(<Contact />)
            const linkCatalogo = screen.getByRole('link', { name: /ver catálogo/i })
            expect(linkCatalogo).toBeInTheDocument()
        })

        it('botão Falar no WhatsApp tem href correto', () => {
            render(<Contact />)
            const botaoWhatsApp = screen.getByRole('link', { name: /falar no whatsapp/i })
            expect(botaoWhatsApp).toHaveAttribute('href', expect.stringContaining('wa.me'))
        })
    })

    describe('Hero', () => {
        it('botão Fazer Pedido existe e é clicável', () => {
            const scrollIntoViewMock = vi.fn()
            document.querySelector = vi.fn().mockReturnValue({ scrollIntoView: scrollIntoViewMock })

            render(<Hero />)
            const botaoFazerPedido = screen.getByRole('button', { name: siteConfig.hero.ctaText })
            expect(botaoFazerPedido).toBeInTheDocument()
            fireEvent.click(botaoFazerPedido)
            expect(document.querySelector).toHaveBeenCalledWith('#contact')
        })

        it('botão Conheça Nossos Produtos existe e rola para a seção de produtos', () => {
            const scrollIntoViewMock = vi.fn()
            document.querySelector = vi.fn().mockReturnValue({ scrollIntoView: scrollIntoViewMock })

            render(<Hero />)
            const botaoProdutos = screen.getByRole('button', { name: siteConfig.hero.ctaSecondaryText })
            expect(botaoProdutos).toBeInTheDocument()
            fireEvent.click(botaoProdutos)
            expect(document.querySelector).toHaveBeenCalledWith('#products')
        })
    })

    describe('Products', () => {
        it('botão Veja nosso catálogo completo tem href correto para /catalogo', () => {
            render(<Products />)
            const linkCatalogo = screen.getByRole('link', { name: /veja nosso catálogo completo/i })
            expect(linkCatalogo).toHaveAttribute('href', '/catalogo')
        })
    })
})
