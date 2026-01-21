// app/actions.ts
"use server";

import * as cheerio from "cheerio";

export async function extractFormData(htmlContent: string) {
  if (!htmlContent) return { error: "No HTML content provided" };

  try {
    const $ = cheerio.load(htmlContent);
    const results: Record<string, string | string[]> = {};

    $('div[role="listitem"]').each((_index, element) => {
      const item = $(element);

      // 1. Extract Question Title
      let questionTitle = item.find(".M7eMe").first().text().trim();
      questionTitle = questionTitle.replace(/\s*\*$/, "").trim(); // Remove trailing *

      if (!questionTitle) return;

      // 2. Extract Answers

      // Case A: Text Inputs
      const textInput = item.find('div[role="textbox"]');
      if (textInput.length > 0) {
        results[questionTitle] = textInput.text().trim();
        return;
      }

      // Case B: Radio Buttons (Selected)
      const selectedRadio = item.find('div[role="radio"][aria-checked="true"]');
      if (selectedRadio.length > 0) {
        const val =
          selectedRadio.attr("data-value") ||
          selectedRadio.attr("aria-label") ||
          "";
        results[questionTitle] = val.trim();
        return;
      }

      // Case C: Checkboxes (Selected)
      const selectedCheckboxes = item.find(
        'div[role="checkbox"][aria-checked="true"]',
      );
      if (selectedCheckboxes.length > 0) {
        const values: string[] = [];
        selectedCheckboxes.each((_, checkbox) => {
          const val =
            $(checkbox).attr("data-value") || $(checkbox).attr("aria-label");
          if (val) values.push(val.trim());
        });
        results[questionTitle] = values.length === 1 ? values[0] : values;
        return;
      }

      // Case D: Display Value (Read-only text)
      const displayValue = item.find(".Mh5jwe.JqSWld").text().trim();
      if (displayValue && !results[questionTitle]) {
        results[questionTitle] = displayValue;
      }
    });

    return { success: true, data: results };
  } catch (e) {
    console.error(e);
    return { error: "Failed to parse HTML" };
  }
}
