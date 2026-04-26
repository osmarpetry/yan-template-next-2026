Feature: Jobs dashboard
  As the private operator
  I want a stable dashboard shell for raw job review
  So I can inspect live feeds from one route

  Scenario: Load the jobs table with source options
    Given the jobs dashboard is open
    When I open the source filter menu
    Then I should see all source toggle options
    And I should see all fixture jobs in the table
    And I should see the jobs summary "Showing 7 of 7 jobs."

  Scenario: Toggle a source and update the table
    Given the jobs dashboard is open
    When I open the source filter menu
    And I disable the Ashby source
    Then I should see only the non-Ashby jobs in the table
    And I should see the jobs summary "Showing 6 of 7 jobs."
    And the source filter button should show "6 sources"

  Scenario: Search the table and restore it
    Given the jobs dashboard is open
    When I search visible jobs for "landing"
    Then I should see only the Landing.jobs job in the table
    And I should see the jobs summary "Showing 1 of 7 jobs."
    When I clear the jobs search
    Then I should see all fixture jobs in the table
    And I should see the jobs summary "Showing 7 of 7 jobs."

  Scenario: Apply a quick preset
    Given the jobs dashboard is open
    When I apply the Platform infra quick preset
    Then I should see only the platform and infra jobs in the table
    And I should see the jobs summary "Showing 3 of 7 jobs."
