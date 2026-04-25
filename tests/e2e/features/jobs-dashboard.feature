Feature: Jobs dashboard
  As the private operator
  I want a stable dashboard shell for raw job review
  So I can inspect live feeds from one route

  Scenario: Load the jobs table with source options
    Given the jobs dashboard is open
    When I open the source filter menu
    Then I should see all source toggle options
    And I should see all fixture jobs in the table
    And I should see the jobs summary "Showing 3 of 3 jobs."

  Scenario: Toggle a source and update the table
    Given the jobs dashboard is open
    When I open the source filter menu
    And I disable the Remotive source
    Then I should see only the non-Remotive jobs in the table
    And I should see the jobs summary "Showing 2 of 3 jobs."
    And the source filter button should show "2 sources"

  Scenario: Search the table and restore it
    Given the jobs dashboard is open
    When I search visible jobs for "orbit"
    Then I should see only the Orbit job in the table
    And I should see the jobs summary "Showing 1 of 3 jobs."
    When I clear the jobs search
    Then I should see all fixture jobs in the table
    And I should see the jobs summary "Showing 3 of 3 jobs."
