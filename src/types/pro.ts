/**
 * File:     pro.ts
 * Purpose:  Types for the Patient Reported Outcomes tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type PatientReportedOutcome = {
  id: string;
  recorded_date: number;
  question: string;
  response: number;
};

export type ProQuestion = {
  id: string;
  category: string;
  question: string;
  question_type: string;
  lowest_ranking?: number;
  highest_ranking?: number;
  lowest_label?: string;
  highest_label?: string;
};

export const PRO_SCHEMA = `CREATE TABLE IF NOT EXISTS patient_recorded_outcome (
    id TEXT NOT NULL PRIMARY KEY,
    recorded_date INTEGER NOT NULL,
    question TEXT NOT NULL,
    response INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS pro_question (
    id TEXT NOT NULL PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL,
    lowest_ranking INTEGER,
    highest_ranking INTEGER,
    lowest_label TEXT,
    highest_label TEXT
) STRICT;

INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("0", "Patient Health Questionnaire-9", "Little interest or pleasure in doing things.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("1", "Patient Health Questionnaire-9", "Feeling down, depressed, or hopeless.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("2", "Patient Health Questionnaire-9", "Trouble falling or staying asleep, or sleeping too much.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("3", "Patient Health Questionnaire-9", "Feeling tired or having little energy.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("4", "Patient Health Questionnaire-9", "Poor appetite or overeating.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("5", "Patient Health Questionnaire-9", "Feeling bad about yourself—or that you are a failure or have let yourself or your family down.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("6", "Patient Health Questionnaire-9", "Trouble concentrating on things, such as reading the newspaper or watching television.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("7", "Patient Health Questionnaire-9", "Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving a lot more than usual.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("8", "Patient Health Questionnaire-9", "Thoughts that you would be better off dead or of hurting yourself in some way.", "rating", 0, 3, "Not at all", "Nearly every day");

INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("9", "Generalized Anxiety Disorder-7", "Feeling nervous, anxious, or on edge.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("10", "Generalized Anxiety Disorder-7", "Not being able to stop or control worrying.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("11", "Generalized Anxiety Disorder-7", "Worrying too much about different things.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("12", "Generalized Anxiety Disorder-7", "Trouble relaxing.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("13", "Generalized Anxiety Disorder-7", "Being so restless that it's hard to sit still.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("14", "Generalized Anxiety Disorder-7", "Becoming easily annoyed to irritable.", "rating", 0, 3, "Not at all", "Nearly every day");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("15", "Generalized Anxiety Disorder-7", "Feeling afraid as if something awful might happen.", "rating", 0, 3, "Not at all", "Nearly every day");

INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("16", "Insomnia Severity Index", "Rate the current (last 2 weeks) severity of insomnia problem(s): Difficulty falling asleep, difficulty staying asleep, or problems waking up too early.", "rating", 0, 4, "No problem", "Very severe problem");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("17", "Insomnia Severity Index", "How satisfied are you with your current sleep pattern?", "rating", 0, 4, "No problem", "Very severe problem");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("18", "Insomnia Severity Index", "How noticeable to others do you think your sleep problem is in terms of impairing your quality of life?", "rating", 0, 4, "No problem", "Very severe problem");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("19", "Insomnia Severity Index", "How worried or distressed are you about your current sleep problem?", "rating", 0, 4, "No problem", "Very severe problem");
INSERT INTO pro_question(id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label) VALUES ("20", "Insomnia Severity Index", "To what extent do you consider you sleep problem to interfere with your daily functioning?", "rating", 0, 4, "No problem", "Very severe problem");`;
