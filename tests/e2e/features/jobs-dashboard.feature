Feature: Jobs dashboard
  As the private operator
  I want a stable dashboard shell for raw job review
  So I can inspect live feeds from one route

  Scenario: Open the jobs dashboard
    Given the jobs dashboard is open
    Then I should see the raw jobs review controls

  Scenario: Open the source filter menu
    Given the jobs dashboard is open
    When I open the source filter menu
    Then I should see all source toggle options
