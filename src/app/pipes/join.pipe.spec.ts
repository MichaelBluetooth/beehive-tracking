import { JoinPipe } from "./join.pipe";

fdescribe("JoinPipe", () => {
  const pipe = new JoinPipe();

  it("joins the array", () => {
    expect(pipe.transform(["1", "2"])).toEqual("1, 2");
  });
});
