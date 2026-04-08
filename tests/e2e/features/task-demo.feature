Feature: Sample task demo
  As a template consumer
  I want a working realtime example
  So I can trust the starter before building a real product flow

  Scenario: Start a sample task and see staged progress
    Given the sample task demo is open
    When I start a sample task
    Then I should see staged task progress

  Scenario: Refresh restores the active task snapshot
    Given the sample task demo is open
    When I start a sample task
    And I refresh the page during the run
    Then the active task should still be restored

  Scenario: Reconnecting resumes updates
    Given the sample task demo is open
    When I start a sample task
    And I reconnect the live stream
    Then the task should still complete
