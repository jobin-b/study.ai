"use client";

import React, { useState } from "react";

const flashcardsData = [
  {
    topic: "Introduction",
    back: "What is the purpose of the test plan? What is the importance of comprehensive testing? What are the key testing objectives? What is the scope of testing? Who is the target audience for this test plan?",
  },
  {
    topic: "Test Strategy",
    back: "What kind of testing strategy is being used for this project? What are the different levels of testing involved? What is the order in which they will be performed?",
  },
  {
    topic: "Test Objectives",
    back: "What are the specific goals of the testing process?  What are the key aspects being tested? What are the expected outcomes of the testing?",
  },
  {
    topic: "Test Scope",
    back: "What specific functionalities and nonfunctional requirements are included in the testing? What are the different types of tests being performed?  What components or modules are being tested?",
  },
  {
    topic: "Test Deliverables",
    back: "What specific documents and artifacts will be produced during the testing process? What information will be included in each deliverable? What is the purpose of each deliverable?",
  },
  {
    topic: "Test Schedule",
    back: "When will testing be performed? How frequently will testing occur?  What are the specific milestones or deadlines associated with testing?",
  },
  {
    topic: "Test Environment",
    back: "What kind of hardware and software is needed for the testing process? What environmental variables need to be considered? What are the network connectivity requirements?",
  },
  {
    topic: "Test Entry and Exit Criteria",
    back: "What conditions need to be met before testing can begin? What conditions need to be met to consider testing complete?",
  },
  {
    topic: "Test Pass and Fail Criteria",
    back: "How will the success of a test case be determined? What specific criteria will be used to assess whether a test has passed or failed? Are there any specific pass/fail criteria for individual test cases?",
  },
  {
    topic: "Test Suspension and Resumption Criteria",
    back: "Under what circumstances will testing be paused? What conditions need to be met before testing can resume?",
  },
  {
    topic: "Test Design and Execution",
    back: "How will the tests be designed and executed? Will the tests be automated or manually executed? What tools or techniques will be used to execute the tests?",
  },
  {
    topic: "Test Data and Defect Management",
    back: "How will test data be collected and recorded? How will defects be identified and reported? What is the process for tracking and resolving defects?",
  },
  {
    topic: "Risk Analysis",
    back: "What are the potential risks associated with testing? What are the mitigation strategies for each risk? How will risks be monitored and managed during testing?",
  },
  {
    topic: "Roles and Responsibilities",
    back: "Who is responsible for which aspects of the testing process?  What are the specific roles and responsibilities of each team member?",
  },
  {
    topic: "Course Reviews",
    back: "What specific functionalities are being tested within Course Reviews? What are the expected outcomes of these tests? What are the specific test cases for Course Reviews?",
  },
  {
    topic: "Room Reservations",
    back: "What specific functionalities are being tested within Room Reservations? What are the expected outcomes of these tests? What are the specific test cases for Room Reservations?",
  },
  {
    topic: "Schedule Builder",
    back: "What specific functionalities are being tested within Schedule Builder? What are the expected outcomes of these tests? What are the specific test cases for Schedule Builder?",
  },
  {
    topic: "Locked/Blacklist Sections",
    back: "What specific functionalities are being tested within Locked/Blacklist Sections? What are the expected outcomes of these tests? What are the specific test cases for Locked/Blacklist Sections?",
  },
  {
    topic: "Server Performance",
    back: "What specific performance metrics are being tested? What are the expected outcomes of these tests? What are the specific test cases for Server Performance?",
  },
  {
    topic: "Reliability",
    back: "What aspects of the application's reliability are being tested? What are the expected outcomes of these tests? What are the specific test cases for Reliability?",
  },
  {
    topic: "Availability and Portability",
    back: "What aspects of the application's availability and portability are being tested? What are the expected outcomes of these tests? What are the specific test cases for Availability and Portability?",
  },
  {
    topic: "Security",
    back: "What security vulnerabilities are being tested? What are the expected outcomes of these tests? What are the specific test cases for Security?",
  },
  {
    topic: "Integration Testing",
    back: "What are the key areas of focus for integration testing? What are the expected outcomes of integration testing? What are the specific test cases for Integration Testing?",
  },
];

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsData.length);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcardsData.length) % flashcardsData.length
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = flashcardsData[currentCardIndex];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Flashcard Quiz
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Test Your Knowledge
            </h2>
          </div>

          {/* Flashcard */}
          <div className="mx-auto max-w-sm">
            <div
              className="group/card relative h-64 overflow-hidden rounded-2xl bg-gray-800 p-px cursor-pointer"
              onClick={handleFlip}
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <p className="text-xl font-semibold text-indigo-200/65">
                    {isFlipped ? currentCard.back : currentCard.topic}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevCard}
                className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-1.5 text-sm font-medium text-indigo-200/65 hover:bg-gray-800/60"
              >
                Previous
              </button>
              <button
                onClick={handleNextCard}
                className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-1.5 text-sm font-medium text-indigo-200/65 hover:bg-gray-800/60"
              >
                Next
              </button>
            </div>

            {/* Card counter */}
            <div className="mt-4 text-center text-sm text-indigo-200/65">
              Card {currentCardIndex + 1} of {flashcardsData.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashcardApp;
