import { FrameLastInspectedPipe } from './frame-last-inspected.pipe';

fdescribe("FrameLastInspectedPipe", () => {
  const pipe = new FrameLastInspectedPipe();

  it("handles null", () => {
    expect(pipe.transform(null)).toBe(null);
  });

  it("handles frames with no notes", () => {
    expect(pipe.transform({})).toBe(null);
  });

  it("handles frames with empty notes", () => {
    expect(pipe.transform({ notes: [] })).toBe(null);
  });

  it("finds the latest date", () => {
    const expectedDate = new Date(2019, 3, 10);
    expect(
      pipe.transform({
        notes: [{ date: new Date(2019, 2, 5) }, { date: expectedDate }],
      })
    ).toEqual(expectedDate);
  });
});
