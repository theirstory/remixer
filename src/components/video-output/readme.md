# ts-video-output



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type      | Default     |
| -------------- | --------------- | ----------- | --------- | ----------- |
| `clips`        | --              |             | `Clip[]`  | `[]`        |
| `remixedVideo` | `remixed-video` |             | `string`  | `undefined` |
| `remixing`     | `remixing`      |             | `boolean` | `undefined` |


## Events

| Event            | Description | Type                  |
| ---------------- | ----------- | --------------------- |
| `removedClip`    |             | `CustomEvent<Clip>`   |
| `reorderedClips` |             | `CustomEvent<Clip[]>` |
| `save`           |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [ts-video-remixer](../video-remixer)

### Depends on

- [ts-video-player](../video-player)
- ion-reorder-group
- ion-item
- ion-label
- ion-button
- ion-icon
- ion-reorder

### Graph
```mermaid
graph TD;
  ts-video-output --> ts-video-player
  ts-video-output --> ion-reorder-group
  ts-video-output --> ion-item
  ts-video-output --> ion-label
  ts-video-output --> ion-button
  ts-video-output --> ion-icon
  ts-video-output --> ion-reorder
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
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-reorder --> ion-icon
  ts-video-remixer --> ts-video-output
  style ts-video-output fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
