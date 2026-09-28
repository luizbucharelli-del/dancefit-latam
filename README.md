# DanceFit LATAM

Quiz e página de oferta em espanhol LATAM. 25 etapas, 17 perguntas, layout responsivo e pagamento único de **US$ 9,90**.

## Abrir localmente

Com Node.js instalado, execute nesta pasta:

```sh
npm run dev
```

Abra `http://127.0.0.1:4173`. Os arquivos publicados ficam em `dist/`; podem ser servidos por uma hospedagem estática. Abrir o HTML diretamente pelo explorador (`file://`) não é suportado pelos módulos JavaScript: use o servidor local.

## Checkout — configuração pendente

Edite `dist/config.js` e preencha `checkoutUrl` com o endereço HTTPS real do checkout. O preço exibido não altera o preço cadastrado na plataforma de pagamento: configure US$ 9,90 também nessa plataforma.

Enquanto o endereço não for informado, os dois botões de compra abrem uma mensagem de inscrições em breve. Não há checkout fictício, cobrança, coleta de cartão nem confirmação de compra simulada. Nome, medidas e respostas não são acrescentados à URL do checkout; apenas parâmetros UTM conhecidos são preservados.

`compareAtPrice` está nulo porque a copy trouxe US$ 9,90 como preço anterior e atual. Um preço riscado só aparece quando configurado e maior que o preço de venda. `offerEndsAt` também está nulo: o cronômetro só aparece quando houver uma data real em formato ISO. Não há contagem reiniciável.

## Imagens

A pasta de origem é `../imagens funil`. PNG, JPG, JPEG e WebP são reconhecidos. Espaços, acentos e maiúsculas são normalizados nas chaves; `pergunta1 (2).png` funciona como `pergunta1(2).png`.

O servidor local sincroniza as imagens ao iniciar e quando a pasta muda. Recarregue a página após substituir uma imagem. Para atualizar os arquivos de publicação sem iniciar o servidor:

```sh
npm run assets
```

O manifesto de imagens é gerado em `dist/assets-manifest.js`; os arquivos são copiados para `dist/assets/`. Após colocar novas imagens na pasta, uma versão já hospedada ainda precisa ser republicada.

### Mapeamento atual

| Arquivo/chave | Local |
|---|---|
| pergunta1 | 40 a 49 anos; avatar do plano |
| pergunta1(2) | 50+; avatar do plano |
| iconespergunta1, iconespergunta1(2), iconespergunta1(3) | Prova social inicial |
| pergunta2, pergunta2(2), pergunta2(3) | Perder peso, manter forma, aprender dança |
| pergunta3, pergunta3(2), pergunta3(3) | Corpo atual: padrão, flácida, extra |
| pergunta3, pergunta4(definido), pergunta3(2), pergunta3(3) | Corpo desejado: reutilização das imagens da pergunta 3 |
| etapa05 | Tela de acolhimento com três mulheres |
| pergunta11 ou zumba-e-saude-das-mulheres-3 | Primeiro ritmo |
| pergunta11(2) ou zumba-e-saude-das-mulheres-3 (1) | Segundo ritmo |
| provasocial ou etapa10 | Foto do bloco editorial; usa a imagem de dança já fornecida se ausente |
| antesedepois etapa final | Imagem “Ahora” da oferta |
| antesedepois etapa final(2) | Imagem “Tu objetivo”; usa pergunta3 se ausente |
| garantia7dias | Selo gerado em espanhol |
| logo ou dancefit-logo | Logo opcional; quando ausente, usa a marca tipográfica DanceFit |

A numeração `pergunta` conta apenas perguntas. `etapa` conta também telas intermediárias. O mapa de conteúdo está em `dist/content.js`; imagens adicionais podem ser associadas às opções pelo campo `image`. A reutilização especial das perguntas 3 e 4 já está implementada.

## Edição da copy e lógica

- `dist/content.js`: perguntas, opções, depoimentos e FAQ.
- `dist/app.js`: telas intermediárias, resumo, gráfico e oferta.
- `dist/config.js`: preço, moeda, checkout, garantia e prazo da oferta.
- `dist/styles.css`: cores, tipografia e layout.
- `dist/logic.js`: seleção, medidas, personalização e URL de checkout.

Foram corrigidos resíduos de tradução, pontuação e concordância, com tratamento consistente por **tú**: “culata” virou “glúteos”, “a la ligera” virou “a tu ritmo”, “sigiloso” virou “confidencial”, “pol” virou “pulg”, e “Da Ana” virou “de Ana”. A identidade da depoente Márcia foi mantida em vez de renomeá-la como María. Removido “Clone visual” do rodapé comercial.

Dois pontos materiais foram tratados de forma diferente da referência: o resumo devolve a percepção declarada sobre peso em vez de diagnosticar “metabolismo lento”; o gráfico mostra a meta como ilustração, sem prometer atingir qualquer peso em 28 dias. O programa continua apresentado como desafio de 28 dias. O cálculo do IMC usa os valores reais. A entrega do acesso é descrita após confirmação da compra.

Os demais números e depoimentos fornecidos pelo usuário foram mantidos como conteúdo da oferta, sem verificação independente. O código não comprova a existência de 52.347 alunas, 300 aulas ou os resultados citados, nem cria o aplicativo/área de alunas descrito na copy. O escopo implementado é o quiz até a oferta.

## Funcionamento

Escolhas simples avançam após o clique. Perguntas de múltipla escolha têm confirmação. Voltar permite revisar respostas. “Nenhuma das anteriores” exclui outras limitações. Altura e peso podem ser digitados ou ajustados; a troca de unidades converte a mesma medida. Nome, meta, nível, rotina e objetivo aparecem no resultado.

As respostas ficam apenas no `sessionStorage` da aba, com validade de 24 horas. Não há banco de dados, pixel, rastreador externo ou envio de medidas. Recarregar a aba retoma a etapa; uma nova sessão começa do início. Eventos locais opcionais `dancefit:step` e `dancefit:checkout` não transmitem dados por si mesmos.

## Verificação

```sh
npm run check
```

Os testes cobrem seleção exclusiva, conversão de medidas, IMC, resumo dependente das respostas, sanitização do nome, preço em dólares e restrições da URL de checkout.

## Selo de garantia

Gerado com a ferramenta integrada ImageGen, sem API externa. Arquivo de origem: `../imagens funil/garantia7dias.png`. Cópia publicada: `dist/assets/garantia7dias.png`. PNG com transparência; texto: GARANTÍA / 7 / DÍAS / DE DEVOLUCIÓN.

Prompt final:

> Use case: ads-marketing. Asset type: single transparent raster guarantee badge for a women's dance fitness offer in Latin American Spanish. Primary request: a premium circular metallic gold guarantee seal with serrated gold outer edge and deep dark navy blue center, refined polished dimensional metal details. Scene/backdrop: genuinely transparent background with alpha, no painted backdrop, no checkerboard pattern. Composition/framing: square canvas, complete circular seal centered, generous clear margin so no edges are cropped, front-facing. Typography: large, impeccably legible, bold premium uppercase lettering. Exactly four text elements: “GARANTÍA” along the upper arc, a very large “7” in the center, “DÍAS” directly below the numeral, and “DE DEVOLUCIÓN” along the lower arc. Preserve Spanish accents exactly: GARANTÍA, DÍAS, DEVOLUCIÓN. Color palette: metallic gold and dark navy blue; gold lettering on navy. Constraints: one badge only, no price, no additional text, no English or Portuguese, no watermark. Transparent pixels around the badge; preserve alpha.
