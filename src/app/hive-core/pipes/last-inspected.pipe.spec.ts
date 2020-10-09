import { LastInspectedPipe } from "./last-inspected.pipe";

describe("LastInspectedPipe", () => {
  const pipe = new LastInspectedPipe();

  it("handles null", () => {
    expect(pipe.transform(null)).toBe(null);
  });

  it("handles hives with no notes", () => {
    expect(pipe.transform({})).toBe(null);
  });

  it("handles hives with empty notes", () => {
    expect(pipe.transform({ notes: [] })).toBe(null);
  });

  it("handles hives with only notes", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }, { date: expectedDate }],
      })
    ).toEqual(expectedDate);
  });

  it("handles hives boxes that have no notes", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }, { date: expectedDate }],
        parts: [{ label: "b1" }],
      })
    ).toEqual(expectedDate);
  });

  it("handles hives boxes that have notes", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }],
        parts: [{ label: "b1", notes: [{ date: expectedDate }] }],
      })
    ).toEqual(expectedDate);
  });

  it("handles hives boxes that have frames with no notes", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }],
        parts: [
          {
            label: "b1",
            notes: [{ date: expectedDate }],
            frames: [{ label: "f1" }],
          },
        ],
      })
    ).toEqual(expectedDate);
  });

  it("handles hives boxes that have frames with notes", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }],
        parts: [
          {
            label: "b1",
            notes: [{ date: new Date(2019, 3, 2) }],
            frames: [{ label: "f1", notes: [{ date: expectedDate }] }],
          },
        ],
      })
    ).toEqual(expectedDate);
  });
});
