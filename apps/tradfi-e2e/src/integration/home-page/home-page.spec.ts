describe('tradfi: HomePage component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=homepage--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to HomePage!');
    });
});
