import { Controller } from "@hotwired/stimulus"

export default abstract class AbstractController<StimulusElement extends Element> extends Controller {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore see https://discuss.hotwired.dev/t/stimulus-and-typescript/2458
  declare readonly element: StimulusElement
}
