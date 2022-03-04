describe('tradfi: BondsPage component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=bondspage--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to BondsPage!');
    });
});
