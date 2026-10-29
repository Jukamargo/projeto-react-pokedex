# Minha Pokédex

Aplicativo de estudo em **React Native**, **JavaScript (JSX)** e **Expo**. Explore os 151 Pokémon de Kanto, consulte detalhes e salve favoritos com anotações.

## Executar

É necessário ter Node.js e npm instalados. Na pasta do projeto:

```powershell
npm.cmd install
npm.cmd start
```

Você também pode iniciar com `npm run dev`, equivalente a `npm start`.

Leia o QR code com o Expo Go no celular, usando a mesma rede do computador. O terminal também permite abrir um emulador Android configurado com a tecla `a`. Para testar no navegador:

```powershell
npm.cmd run web
```

No Windows, `npm.cmd` funciona mesmo quando o PowerShell bloqueia o script `npm.ps1`. Em outros terminais, você pode usar `npm` normalmente.

## Funcionalidades

- Lista dos 151 Pokémon da primeira geração, com imagens e número na Pokédex.
- Formulário de busca por parte do nome ou número. Digite e toque em **Buscar**, ou envie pelo teclado.
- Detalhes com tipos traduzidos, altura, peso, habilidades e estatísticas. Os nomes das habilidades vêm em inglês da API.
- Adição e remoção de favoritos pela estrela ou pela ficha do Pokémon.
- Anotações opcionais de até 240 caracteres. Salvar uma anotação também adiciona o Pokémon aos favoritos.
- Favoritos e anotações persistidos no dispositivo com AsyncStorage.
- Estados de carregamento, erro, lista vazia e nova tentativa.

## Onde está cada conceito

| Conceito | Exemplo no projeto |
| --- | --- |
| JSX | Estrutura das telas e dos componentes em arquivos `.jsx`. |
| Componentes | `PokemonCard`, `PokemonImage`, `Button`, `Message` e as telas. |
| Props | `PokemonCard` recebe `pokemon`, `favorite`, `onOpen` e `onToggle`. |
| Listas | `FlatList` na Pokédex; `map` para tipos, estatísticas e abas. |
| Renderização condicional | Carregamento, erros, favoritos e resultados vazios. |
| State e `useState` | Texto da busca, filtro aplicado, anotação e favoritos. |
| Formulários | Busca e edição de uma anotação com campos controlados. |
| `useEffect` | Consulta inicial, carregamento dos favoritos, persistência e botão voltar do Android. |
| Consumo de APIs | `fetch` em `src/services/pokeapi.js`, com cache em memória e timeout. |
| React Router | `NativeRouter`, `Routes`, `Route`, `useNavigate` e `useParams` em React Router Native v6. |

**Virtual DOM e React Native:** o React cria uma árvore de elementos e reconcilia as mudanças quando props ou estado mudam. No React Native, o renderizador aplica essas mudanças aos componentes nativos; não existe DOM HTML no Android/iOS. Por exemplo, favoritar um Pokémon altera o estado compartilhado, e o React atualiza as estrelas e o contador na navegação.

## Organização

```text
App.jsx                         # Provedores, layout e rotas
src/
  components/                   # Cartão, imagem, botão e mensagens
  context/FavoritesContext.jsx  # Favoritos compartilhados e persistência
  hooks/useRequest.js           # Consulta assíncrona com useEffect
  screens/PokedexScreen.jsx     # Lista, favoritos e formulário de busca
  screens/DetailsScreen.jsx     # Ficha e formulário de anotação
  services/pokeapi.js            # Comunicação com a API
  theme.js                      # Cores e funções de apresentação
tests/pokeapi.test.js            # Testes do serviço, com fetch simulado
```

As rotas são `/`, `/favoritos` e `/pokemon/:id`. Foi utilizado **React Router Native v6** para praticar especificamente React Router em React Native. `NativeRouter` mantém o histórico na memória; no navegador, as rotas não são refletidas na barra de endereços.

## Verificar

```powershell
npm.cmd test
npm.cmd run build:web
```

Os testes verificam conversão de medidas, validação de IDs, cache, requisições simultâneas e recuperação após erros. A compilação web verifica os imports e a geração do bundle; não substitui testes em Android/iOS.

Na instalação inicial, `npm audit` reportou 10 alertas (5 baixos, 2 moderados e 3 altos) na árvore de dependências do Expo e do React Router Native. As correções sugeridas pelo npm mudam versões principais, incluindo regressões de versão do Expo e do Router, e não foram aplicadas. Isso deve ser reavaliado antes de usar este projeto de estudo em produção.

## Deploy na Vercel

A versão web é exportada pelo Expo como uma aplicação estática. O arquivo `vercel.json` configura a instalação com `npm ci`, a build com `npm run build` e a publicação da pasta `dist`. As demais rotas retornam a página inicial da aplicação.

Na Vercel, importe o repositório `Jukamargo/projeto-react-pokedex`, use a raiz do repositório como **Root Directory** e a branch `main` para produção. O **Framework Preset** é **Other**; os comandos e o diretório de saída são definidos pelo `vercel.json`.

Para validar a exportação antes do deploy:

```powershell
npm.cmd run build
```

Publique a pasta `dist`, gerada por esse comando. O arquivo `index.js` na raiz do projeto é a entrada do código-fonte e precisa ser compilado pelo Expo; servi-lo diretamente não carrega a interface.

Após enviar mudanças para `main`, a integração do GitHub com a Vercel inicia um novo deploy automaticamente. Se o projeto ainda não estiver conectado à integração, faça um novo deploy pelo painel da Vercel.

## Gitflow

O repositório usa `main` para versões estáveis e `develop` para integrar as próximas mudanças.

Para iniciar uma funcionalidade, atualize `develop` e crie uma branch com um nome descritivo:

```powershell
git switch develop
git pull --ff-only
git switch -c feature/filtro-por-tipo
```

Depois de implementar e verificar a mudança, adicione os arquivos alterados, faça o commit e publique a branch:

```powershell
git add src/screens/PokedexScreen.jsx
git commit -m "feat: adiciona filtro por tipo"
git push -u origin feature/filtro-por-tipo
```

Os nomes acima são exemplos para uma próxima implementação. Abra um Pull Request de `feature/filtro-por-tipo` para `develop` no GitHub.

- `feature/*`: nasce de `develop` e volta para `develop` por Pull Request.
- `release/*`: nasce de `develop` quando uma versão está pronta para validação. Depois das verificações, integre em `main` e em `develop`, e marque a versão em `main` com uma tag, como `v1.1.0`.
- `hotfix/*`: nasce de `main` para corrigir uma versão publicada. Integre a correção em `main` e em `develop`, e crie uma tag com a nova versão corrigida.

Antes de integrar mudanças, execute `npm.cmd test` e `npm.cmd run build:web`. Commits devem descrever mudanças reais; exemplos de prefixos são `feat:`, `fix:`, `test:`, `docs:` e `chore:`.

## Escopo e referências

A lista é limitada à região de Kanto para manter o projeto pequeno. A API e as imagens precisam de internet. O cache da API fica na memória da sessão; favoritos e anotações ficam no dispositivo. Não há login nem sincronização entre dispositivos.

- [PokéAPI: documentação e política de uso](https://pokeapi.co/docs/v2)
- [React Router v6: NativeRouter](https://reactrouter.com/6.30.1/router-components/native-router)
- [Expo: documentação](https://docs.expo.dev/)

Pokémon pertence aos seus respectivos titulares. Projeto educacional sem afiliação oficial.
