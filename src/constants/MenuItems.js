const MenuItems = [
  {
    data: [
      { itemTitle: 'Perfil', path: 'Profile', next: 'screen' },
      { itemTitle: 'Extrato', path: 'Extract', next: 'screen' },
      { itemTitle: 'Validações', path: 'Validations', next: 'screen' },
    ],
    sectionTitle: 'Minha conta',
    ind: 0,
  },
  {
    data: [
      { itemTitle: 'Fale conosco', path: 'Contact', next: 'alert' },
      {
        itemTitle: 'Dúvidas frequentes',
        path: 'https://www.unilever.com.br/institucional/duvidas-frequentes',
        next: 'webview',
      },
    ],
    sectionTitle: 'Ajuda',
    ind: 1,
  },
  {
    data: [
      {
        itemTitle: 'Sobre o Programa',
        path: 'https://unilever.com.br/about-loyalty.html',
        next: 'webview',
      },
      {
        itemTitle: 'Sobre o aplicativo',
        path: 'https://unilever.com.br/about-app.html',
        next: 'webview',
      },
      {
        itemTitle: 'Sobre a Unilever',
        path: 'https://unilever.com.br/about-cicloo.html',
        next: 'webview',
      },
    ],
    sectionTitle: 'Informações',
    ind: 2,
  },
  {
    data: [
      {
        itemTitle: 'Termos de Uso',
        path: 'https://unilever.com.br/terms-conditions.html',
        next: 'webview',
      },
      {
        itemTitle: 'Política de Privacidade',
        path: 'https://unilever.com.br/privacy-policy.html',
        next: 'webview',
      },
    ],
    sectionTitle: 'Legal',
    ind: 3,
  },
];

export default MenuItems;
