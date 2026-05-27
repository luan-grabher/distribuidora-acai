"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// Grid substituído por CSS Grid via Box
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { siteConfig } from "@/config/siteConfig";
export function Products() {
    const [selected, setSelected] = useState("all");

    function ProductImage({ src, alt }: { src: string; alt?: string }) {
        const [loaded, setLoaded] = useState(false);

        return (
            <Box sx={{ width: "100%", position: 'relative', aspectRatio: '1 / 1', mb: 1 }}>
                {!loaded && <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />}
                <Image
                    src={src}
                    alt={alt ?? ""}
                    fill
                    sizes="(max-width:600px) 96px, (max-width:900px) 120px, 140px"
                    loading="lazy"
                    onLoadingComplete={() => setLoaded(true)}
                    style={{ objectFit: "cover", borderRadius: 6, opacity: loaded ? 1 : 0, transition: "opacity 200ms ease-in" }}
                />
            </Box>
        );
    }

    const categoryMap = new Map<string, string>();
    siteConfig.products.items.forEach((item) => {
        const key = item.category ?? "other";
        if (!categoryMap.has(key)) categoryMap.set(key, item.categoryLabel ?? item.category ?? item.name);
    });

    const categories = [{ key: "all", label: "Todos" }, ...Array.from(categoryMap.entries()).map(([key, label]) => ({ key, label }))];

    const visible = selected === "all" ? siteConfig.products.items : siteConfig.products.items.filter((p) => (p.category ?? "other") === selected);

    return (
        <Box id="products" sx={{ py: { xs: 8, md: 12 }, background: siteConfig.colors.background }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: siteConfig.colors.primary, fontWeight: 700, letterSpacing: "0.1em", display: "block", mb: 1 }}
                    >
                        {siteConfig.products.overline}
                    </Typography>

                    <Typography variant="h2" sx={{ color: siteConfig.colors.text, mb: 2, fontSize: { xs: "2rem", md: "2.8rem" } }}>
                        {siteConfig.products.title}
                    </Typography>

                    <Typography variant="h6" sx={{ color: siteConfig.colors.text, opacity: 0.6, fontWeight: 400 }}>
                        {siteConfig.products.subtitle}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 4, flexWrap: "wrap" }}>
                    {categories.map((c) => (
                        <Chip
                            key={c.key}
                            label={c.label}
                            clickable
                            color={selected === c.key ? "primary" : "default"}
                            onClick={() => setSelected(c.key)}
                            sx={{ textTransform: "none", fontWeight: 600 }}
                        />
                    ))}
                </Stack>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' } }}>
                    {visible.map((product) => (
                        <Box key={product.name} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                elevation={0}
                                sx={{
                                    width: "100%",
                                    maxWidth: { xs: 160, sm: 220, md: 260 },
                                    border: `1px solid rgba(74, 0, 128, 0.08)`,
                                    borderRadius: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: `0 12px 24px rgba(74, 0, 128, 0.10)`,
                                        borderColor: siteConfig.colors.primary,
                                    },
                                    transition: "all 0.2s ease",
                                    background: siteConfig.colors.surface,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        height: "100%",
                                    }}
                                >
                                    {product.image ? (
                                        <ProductImage src={product.image} alt={product.name} />
                                    ) : (
                                        <Box sx={{ width: "100%", aspectRatio: '1 / 1', mb: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#efefef" }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{product.name}</Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ width: "100%", textAlign: "center", mt: 1 }}>
                                        <Typography variant="subtitle2" sx={{ color: siteConfig.colors.text, fontWeight: 700 }}>
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ color: siteConfig.colors.primary, fontWeight: 800, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                                        >
                                            {product.price}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button component="a" href={siteConfig.nav.catalogoHref} variant="outlined" sx={{ textTransform: "none" }}>
                        Veja nosso catálogo completo
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
