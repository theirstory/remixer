# ts-video-list



<!-- Auto Generated Below -->


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `videoSelected` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [ts-video-remixer](../video-remixer)

### Depends on

- ion-list
- ion-item
- ion-button

### Graph
```mermaid
graph TD;
  ts-video-list --> ion-list
  ts-video-list --> ion-item
  ts-video-list --> ion-button
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ts-video-remixer --> ts-video-list
  style ts-video-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
