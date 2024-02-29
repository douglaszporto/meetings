# Desafio Técnico Pessoa Desenvolvedora React

Segue aqui minha solução para o desafio proposto.

Utilizei o [Figma](https://www.figma.com/file/Imkqj45P5aRhbedUZOQ8tw/CherryIT?type=design&node-id=8%3A603&mode=design&t=ZfkhxjUIO0MzvYjB-1) para ter uma noção do que seria desenvolvido. O intuito não era criar uma tela para usar 100% como resultado (Pixel Perfect), mas sim apenas ter uma ideia geral de o que seria desenvolvido.

Após isto, segui para o react, utilizando Typescript e Vite para a estrutura e utilizei o MUI conforme solicitado.

O armazenamento dos dados está em localStorage (devido à simplicidade) e inicialmente não há dados pré cadastrados.

Os dados são compartilhados entre componentes pelo Context API. Cogitei a possibilidade de utilizar Redux, porém, como foi mencionado explicitamente o Context API, optei por seguir nesta linha.

Para rodar o projeto:
```
cd meetings
npm i
npm start
```

Para visualizar o resultado, basta acessar o navegor em [http://localhost:5173//](http://localhost:5173/). No caso da versão mobile, pode ser visto em [http://192.168.2.106:5173/](http://192.168.2.106:5173/) (lembre-se de alterar o IP para a maquina que está rodando o projeto)

## Funcionalidades

Conforme solicitado, as principais funcionalidades são:

* Cadastro (Visualização/Inclusão/Alteração/Remoção) de eventos na agenda
* Cadastro (Inclusão/Alteração/Remoção) de colaboradores (nome e cor de preferencia)
* Visualização semanal de eventos
* Armazenamento local (com estrutura para consumir um API)
* Filtro por colaborador.
* Troca da semana visualizada.
* Conflito de horário: os cards na agenda são apresentados de forma diferente quando os horários conflitam: um sobrepõe o outro, ocupando menos espaço horizontal, parecido com a do Google Agenda).

## Padrões de código

Optei por seguir alguns padrões e práticas utilizados na própria documentação do MUI, tal como a estilização do componente ser feita interiamente nele (sem arquivos CSS externos). Tentei seguir um padrão de estilo e identação de código que acho confortável (por exemplo, 4 espaços ao invés de 2), embora acredite que em um projeto com mais pessoas, seria ideal que todos seguissem o mesmo padrão.

Outros padrões usados foram: primeiro imports externos, depois imports locais, ordenados por tamanho do nome. Nomes de variáveis e estados em camelCase. Nomes de componentes em PascalCase. Em componentes, primeiro vem a declaração de estado, seguido por hooks, handlers, memos, effects e renders.

## Testes

Fiz a implementação de alguns (poucos) testes unitários. Priorizei os testas unitários dos serviços e lógicas gerais. Porém, o ideial seria implementar tester para cada componente, testar renderização, comportamentos e eventos. Com mais tempo, esta seria a próxima prioridade.

Para rodar os testes:
```
npm run test
```

## Melhorias

Há considerável espaço para melhorias, tais como trocar a estreutura de armazenamento localpara IndexedDB (está utilizando localStorage, pela simplicidade, porém há problemas significativos de performance caso a quantidade de registros aumente). Também há a possibilidade de melhorar o filtro por Colaborador, para permitir exibir a agenda de duas pessoas simultaneamente (hoje, ou são todos, ou é apenas uma pessoa específica).

Outras melhoria seriam confirmações antes de realizar a exclusão de dados, mover um item na agenda para auterá-lo, confirar horário de inicio e fim da agenda, etc. Mas, como o tempo não é infinito, mas ative ao requisitos levantados.

## Conclusão

Espero que atenda às espectativas. No mais, qualquer dúvida, estou à disposição.
Obrigado e até mais :D
