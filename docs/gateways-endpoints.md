# Gateways e endpoints (API externa)

Tabelas no banco: **`gateways`** e **`gateway_endpoints`**. A URL base fica em `gateways.baseUrl`; cada operação (path + método) fica em `gateway_endpoints`, vinculada ao gateway.

## Diferenciar gateways

| Campo | Uso |
|-------|-----|
| `gateways.code` | Identificador único (ex.: `MELHOR_ENVIO`). Pode ser referenciado por `SHIPPING_GATEWAY_CODE` no `.env`. |
| `gateways.purpose` | Texto livre: para que serve (ex.: cálculo de frete Melhor Envio). |
| `gateways.baseUrl` | Origem da API, **sem** path do endpoint (ex.: `https://sandbox.melhorenvio.com.br` ou produção). |
| `gateways.active` | Se `false`, o gateway não é usado. |

## Endpoints registrados (`gateway_endpoints`)

| `code` | `httpMethod` | `path` | Descrição |
|--------|--------------|--------|-----------|
| `SHIPMENT_CALCULATE` | `POST` | `/api/v2/me/shipment/calculate` | Cotação de fretes por produtos ([Melhor Envio](https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos)). Usado na criação do pedido e em `POST /shipping/quote`. |

Para novos endpoints (ex.: compra de etiqueta), insira uma linha em `gateway_endpoints` com o mesmo `gatewayId` do Melhor Envio (ou de outro gateway) e um `code` novo (ex.: `SHIPMENT_PURCHASE`).

## Variáveis de ambiente (token e origem)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `MELHOR_ENVIO_TOKEN` | Sim | Bearer token da API Melhor Envio. |
| `MELHOR_ENVIO_USER_AGENT` | Sim | Cabeçalho exigido pela API (ex.: `AtelieDaCassia (suporte@email.com)`). |
| `MELHOR_ENVIO_ORIGIN_POSTAL_CODE` | Sim | CEP de origem (loja), 8 dígitos. |
| `SHIPPING_GATEWAY_CODE` | Não | Padrão: `MELHOR_ENVIO`. |
| `MELHOR_ENVIO_SERVICES` | Não | Ex.: `1,2,18` para restringir serviços. |
| `MELHOR_ENVIO_DEFAULT_*` | Não | Peso/dimensões padrão quando o produto não tem `shippingWeightKg` / `shipping*Cm` cadastrados. |

## Produtos e cubagem

Campos opcionais em `products`: `shippingWeightKg`, `shippingLengthCm`, `shippingWidthCm`, `shippingHeightCm`. Se ausentes, usam-se os defaults de `MELHOR_ENVIO_DEFAULT_*`.

## Seed inicial

A migration `20260319120000_gateways_and_product_shipping` insere o gateway `MELHOR_ENVIO` (sandbox) e o endpoint `SHIPMENT_CALCULATE`. Em produção, atualize `baseUrl` no banco para a URL oficial do Melhor Envio, se diferente.
