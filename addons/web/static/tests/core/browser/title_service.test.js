import { beforeEach, describe, expect, test } from "@betopiaerp/hoot";
import { getService, makeMockEnv } from "@web/../tests/web_test_helpers";

describe.current.tags("headless");

let titleService;

beforeEach(async () => {
    await makeMockEnv();
    titleService = getService("title");
});

test("simple title", () => {
    titleService.setParts({ one: "MyBetopiaERP" });
    expect(titleService.current).toBe("MyBetopiaERP");
});

test("add title part", () => {
    titleService.setParts({ one: "MyBetopiaERP", two: null });
    expect(titleService.current).toBe("MyBetopiaERP");
    titleService.setParts({ three: "Import" });
    expect(titleService.current).toBe("MyBetopiaERP - Import");
});

test("modify title part", () => {
    titleService.setParts({ one: "MyBetopiaERP" });
    expect(titleService.current).toBe("MyBetopiaERP");
    titleService.setParts({ one: "Zopenerp" });
    expect(titleService.current).toBe("Zopenerp");
});

test("delete title part", () => {
    titleService.setParts({ one: "MyBetopiaERP" });
    expect(titleService.current).toBe("MyBetopiaERP");
    titleService.setParts({ one: null });
    expect(titleService.current).toBe("BetopiaERP");
});

test("all at once", () => {
    titleService.setParts({ one: "MyBetopiaERP", two: "Import" });
    expect(titleService.current).toBe("MyBetopiaERP - Import");
    titleService.setParts({ one: "Zopenerp", two: null, three: "Sauron" });
    expect(titleService.current).toBe("Zopenerp - Sauron");
});

test("get title parts", () => {
    expect(titleService.current).toBe("");
    titleService.setParts({ one: "MyBetopiaERP", two: "Import" });
    expect(titleService.current).toBe("MyBetopiaERP - Import");
    const parts = titleService.getParts();
    expect(parts).toEqual({ one: "MyBetopiaERP", two: "Import" });
    parts.action = "Export";
    expect(titleService.current).toBe("MyBetopiaERP - Import"); // parts is a copy!
});
