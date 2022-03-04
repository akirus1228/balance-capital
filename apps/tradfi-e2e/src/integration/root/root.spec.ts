describe('tradfi: Root component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=root--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Root!');
    });
});
