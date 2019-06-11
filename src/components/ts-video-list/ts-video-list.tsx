import { Component, Prop, h, State } from "@stencil/core";

@Component({
  tag: "ts-video-list",
  styleUrl: "ts-video-list.css",
  shadow: true
})
export class TSVideoList {
  @Prop() endpoint: string;
  @State() videos: string[] = [];

  async request(url: string) {
    let response;

    try {
      response = await fetch(url, {
        headers: {
          "content-type": "application/json"
        }
      });
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  async componentWillLoad() {
    this.videos = await this.request(this.endpoint + "/videos");
  }

  render() {
    return (
      <ion-list>
        {this.videos.map((video: string) => {
          return (
            <ion-item>
              {video}
            </ion-item>
          );
        })}
      </ion-list>
    );
  }
}
