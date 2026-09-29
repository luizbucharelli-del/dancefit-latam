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

`compareAtPrice` está nulo porque a copy trouxe US$ 9,90 como preço anterior e atual. Um preço riscado só aparece quando configurado e maior que o preço de venda.

O contador inicia em 08:19 ao abrir a etapa final. É identificado como tempo orientativo para revisar o plano, sem prazo comercial. Ao chegar a zero, ambos os botões continuam ativos. `reviewDurationSeconds` configura a duração. A configuração do checkout real permanece pendente.

## Personalização

`dist/logic.js` monta quatro semanas por regras determinísticas. Experiência, atividade atual, tempo disponível e histórico determinam o ponto de partida e progressão. Ritmo escolhido é respeitado; automático considera experiência e rotina. Todos os objetivos e áreas selecionados são preservados, com áreas alternadas nas semanas. Limitações suspendem progressão automática e pedem revisão dos movimentos antes de começar. Idade, percepção corporal, medidas, evento e histórico aparecem no resumo; imagens finais seguem as escolhas corporais. Peso atual e meta ajustam a mensagem, inclusive manutenção ou respostas contraditórias, sem prever quilos perdidos nem diagnosticar metabolismo. Voltar e editar respostas recalcula o plano.

As semanas são uma proposta organizacional, não prescrição clínica nem seleção de aulas reais de um catálogo conectado. A orientação de começar gradualmente e revisar limitações acompanha as [orientações gerais do CDC](https://www.cdc.gov/physical-activity-basics/guidelines/chronic-health-conditions-and-disabilities.html). As avaliações com Lucía Fernández e Carmen García estão identificadas como exemplos ilustrativos com nomes fictícios; substituir por relatos autorizados antes de usá-las como prova social real.

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
| etapa09-es ou etapa09 | Recorte da notícia em espanhol, com fotos preservadas e título azul sobre faixas verdes |
| antesedepois etapa final | Imagem “Ahora” da oferta |
| antesedepois etapa final(2) | Imagem “Tu objetivo”; usa pergunta3 se ausente |
| garantia7dias | Selo gerado em espanhol |
| logo ou dancefit-logo | Logo opcional; quando ausente, usa a marca tipográfica DanceFit |

A numeração `pergunta` conta apenas perguntas. `etapa` conta também telas intermediárias. Nas perguntas de alternativas, novas imagens seguem automaticamente `perguntaN`, `perguntaN(2)`, `perguntaN(3)` etc., na ordem das opções. O mapa de conteúdo está em `dist/content.js`; o campo `image` permite uma associação explícita e tem prioridade. A reutilização especial das perguntas 3 e 4 já está implementada.

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

As respostas ficam apenas no `sessionStorage` da aba, com validade de 24 horas. Não há banco de dados nem envio de medidas. A página carrega o Pixel da Meta (PageView e InitiateCheckout no clique de compra) e o pixel da Utmify, ambos em `dist/index.html`; nome, medidas e respostas não são enviados a eles. Recarregar a aba retoma a etapa; uma nova sessão começa do início. Eventos locais opcionais `dancefit:step` e `dancefit:checkout` não transmitem dados por si mesmos.

## Verificação

```sh
npm run check
```

Os testes cobrem seleção exclusiva, conversão de medidas, IMC, resumo dependente das respostas, sanitização do nome, preço em dólares e restrições da URL de checkout.

## Selo de garantia

Gerado com a ferramenta integrada ImageGen, sem API externa. Arquivo de origem: `../imagens funil/garantia7dias.png`. Cópia publicada: `dist/assets/garantia7dias.png`. PNG com transparência; texto: GARANTÍA / 7 / DÍAS / DE DEVOLUCIÓN.

Prompt final:

> Use case: ads-marketing. Asset type: single transparent raster guarantee badge for a women's dance fitness offer in Latin American Spanish. Primary request: a premium circular metallic gold guarantee seal with serrated gold outer edge and deep dark navy blue center, refined polished dimensional metal details. Scene/backdrop: genuinely transparent background with alpha, no painted backdrop, no checkerboard pattern. Composition/framing: square canvas, complete circular seal centered, generous clear margin so no edges are cropped, front-facing. Typography: large, impeccably legible, bold premium uppercase lettering. Exactly four text elements: “GARANTÍA” along the upper arc, a very large “7” in the center, “DÍAS” directly below the numeral, and “DE DEVOLUCIÓN” along the lower arc. Preserve Spanish accents exactly: GARANTÍA, DÍAS, DEVOLUCIÓN. Color palette: metallic gold and dark navy blue; gold lettering on navy. Constraints: one badge only, no price, no additional text, no English or Portuguese, no watermark. Transparent pixels around the badge; preserve alpha.

## Recorte de notícia em espanhol

Imagem editada pela ferramenta integrada ImageGen a partir do recorte em português enviado pelo usuário. Arquivo: `../imagens funil/etapa09-es.png`. A tela de notícia usa a imagem inteira, sem a foto genérica de dança nem um título duplicado em HTML. As curvas laterais da pergunta de relação com o peso usam traços verdes e vermelhos, e as perguntas ilustradas com emojis seguem a referência enviada.

Prompt final da edição:

> Use case: text-localization. Asset type: localized Spanish LATAM editorial news clipping. Edit target: attached image. Change ONLY the Portuguese text to Spanish LATAM. Preserve rigorously the horizontal layout and overall proportions of the reference, approximately 715:408. White fully opaque background. Produce a large legible raster, approximately 1536 pixels wide. Preserve both left-side photographs exactly, the same women, faces, bodies, poses, clothing, photo framing and arrangement; do not recreate or change their transformation. Preserve the large blue headline on separate pale lime-green highlight strips to the right. Preserve small black caption and gray photo credit under the photographs, and bold black authorship below the headline. No extra branding. Headline: “Madre e hija adelgazan 83 kg con una clase de baile que quema 800 calorías”. Caption: “Jaime y Jean practican una modalidad que combina baile con ejercicios de fuerza”. Credit: “Imagen: Reproducción de Instagram”. Authorship: “De VivaBem”. Ensure Spanish accents and spelling are exact. Do not add DanceFit, any product relationship, other logos, text, objects, or decorations. Only localize the text; preserve the actual source photographs.


## Revisão cultural — 29/09/2026

O resumo do plano tem somente cinco cartões personalizados, seguindo a referência. A lógica de personalização continua ativa na rotina, nível, objetivos e oferta. Ritmos: cumbia, merengue e bachata; a opção animada usa “baile fitness”. “EXTRA” foi substituído por “Con más volumen”. O recorte VivaBem não é mais exibido: a etapa contém argumento próprio, sem atribuição de terceiros. Os antigos exemplos de depoimentos deram lugar a cartões de benefícios, sem pessoas, estrelas ou alegações de perda de peso. O texto publicitário revisado está em `../copy anuncio.txt`.


A etapa da notícia voltou a exibir o recorte em espanhol, agora com a imagem `etapa09-sem-fonte.png`, sem o crédito VivaBem. O contador não anuncia expiração de oferta e não bloqueia a compra.
