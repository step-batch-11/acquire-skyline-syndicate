You are performing a **cross-file code review** for a group project (Acquire
game).

---

# 🎯 **Goal**

Generate an **overall cross-file code review** that identifies **only problems**
across all files.

- Focus on backend and frontend logic only
- Do **not** include UI or styling
- Include **file name, line number, function, or snippet** for each problem
- Include **code snippet only for major issues**
- Add **"Why" only if the problem is not obvious

---

# 🔍 **REVIEW SCOPE**

### 1. Architecture

- Detect **data leakage** (one model modifying another model’s internal state)
- Detect **handlers doing full game logic / multi-responsibility**
- Check if **same data is modified in multiple places**

### 2. Module Management

- Detect **circular dependencies across files**
- Detect **duplicate or repeated logic/functions**

### 3. Code Patterns

- Check **async handling** (`await`, promises, `.then()`)
- Detect **inconsistent return types**
- Verify **backend responses are consistent**
- Check **request/response format matches frontend expectations**

### 4. Naming & Consistency

- Detect **variable/function naming inconsistencies** (e.g., `context`, `ctx`,
  `c`)
- Ensure **similar operations have consistent names**

### 5. Function Size & Modularization

- Flag **functions >20 lines**
- Flag **functions doing multiple unrelated tasks**
- Identify **logic that can be separated into reusable functions**

### 6. Other Concerns

- Detect **literal strings that could be constants**
- Detect **large files that should be modularized**

---

# ⚠️ **WHEN TO INCLUDE SNIPPETS**

- Complex conditions
- Multi-responsibility functions
- Async issues
- Data leakage
- Duplicate logic
- Naming inconsistencies
- API request/response mismatches
- Large functions / literal strings

Skip snippet for minor unused variables or trivial naming issues.

---

# ✅ **OUTPUT FORMAT**

- Group bullets by concern: Architecture, Module Management, Code Patterns,
  Naming & Consistency, Function Size/Modularization, Other Concerns
- Each bullet must reference **file + line or function or snippet**
- Only problems, no suggestions
- Example:

  - ❌ Problem: Handler modifies multiple models (data leakage) Where:
    `player.js` Line 40, `board.js` Line 25

    ```js
    board.tiles[this.position] = this;
    ```

---

## Command

- bat --style header --decorations always index.html scripts/_.js styles/_.css |
  pbcopy

public/index.html public/js/_.js public/pages/_ src/handlers/_.js
src/models/_.js src/routes/_.js src/_.js main.js
