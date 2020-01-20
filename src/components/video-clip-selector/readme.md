# ts-video-clip-selector



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `video`  | `video`   |             | `string` | `undefined` |


## Events

| Event      | Description | Type                      |
| ---------- | ----------- | ------------------------- |
| `annotate` |             | `CustomEvent<Annotation>` |
| `edit`     |             | `CustomEvent<Annotation>` |


## Dependencies

### Used by

 - [ts-video-remixer](../video-remixer)

### Depends on

- [ts-video-player](../video-player)

### Graph
```mermaid
graph TD;
  ts-video-clip-selector --> ts-video-player
  ts-video-player --> ts-video-controls
  ts-video-controls --> ts-timeline
  ts-video-controls --> ts-play-button
  ts-video-controls --> ts-time
  ts-video-controls --> ts-timeline-actions
  ts-play-button --> ion-button
  ts-play-button --> ion-icon
  ion-button --> ion-ripple-effect
  ts-timeline-actions --> ion-button
  ts-timeline-actions --> ion-icon
  ts-video-remixer --> ts-video-clip-selector
  style ts-video-clip-selector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
