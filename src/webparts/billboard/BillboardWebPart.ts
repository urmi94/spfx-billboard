import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneCheckbox,
  PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BillboardWebPart.module.scss';
import * as strings from 'BillboardWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';

import * as $ from 'jquery';

declare var jQuery:any;
declare var Bluebox:any;



export interface IBillboardWebPartProps {
  isReqItemLimit: boolean;
  isReqItemDur: boolean;
  itemLimit: number; 
  itemDuration: number; 
  includeTitle: boolean;
}

export default class BillboardWebPart extends BaseClientSideWebPart<IBillboardWebPartProps> {

  public render(): void {
    
    var _options = {
      data: {
        subSiteUrl: "",                 //Site subsite url, empty if list is on site collection level.
        listTitle: "Billboard",         //List Title
        category: "Initiative",         //Data Category to display
      },
    
      display: {
        htmlId: 'bb-billboard',         //HTML ID to inject the data, Make sure it matches with the ID at the top.
    
        itemLimit: this.properties.isReqItemLimit ? this.properties.itemLimit : 0,                   //Maximum number of items to display, 0 to set as no limit.
        itemDuration: this.properties.isReqItemDur ? this.properties.itemDuration : 0,                //Number of seconds to cycle the item, 0 to disable cycling.
    
        includePadding: false,          //Set to false in order to remove padding.
        includeTitle: this.properties.includeTitle,			//Set to true to render image caption.
    
        renditionWidth: 600,            //Set to 0 to skip rendition.
        renditionHeight: 205,           //Set to 0 to skip rendition.
      }
    };
    console.log("options ", _options);
    this.domElement.innerHTML = '<div id="bb-billboard" class="bb-listview"></div>';

     SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/scripts/Bluebox.Constants.js', {globalExportsName: 'Bluebox.Constants'})
      .then(() => {
        SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/scripts/Bluebox.Loader.js', {globalExportsName: 'Bluebox.Loader'})
        .then(() => {
          SPComponentLoader.loadScript('https://bbxclientsdevstoragecdn.blob.core.windows.net/urmi-broadcast/Billboard.js', {globalExportsName: 'Bluebox.Billboard'})
          // SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/webparts/billboard/billboard_utilwait.js', {globalExportsName: 'Bluebox.Billboard'})
          .then(()=> Bluebox.Billboard.Execute(true,_options))
          .catch(() => console.log("Bluebox.Billboard not loaded"));
        })
        .catch(() => console.log("Bluebox.Loader not loaded"));
      })
      .catch(() => console.log("Bluebox.Constants not loaded"));
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    let itemLimitConfig: any = [];
    let itemDurationConfig: any = [];

    console.log("this.properties.isReqItemLimit", this.properties.isReqItemLimit);

    if (this.properties.isReqItemLimit) {
      itemLimitConfig = PropertyPaneSlider('itemLimit',{  
        label:"Maximum items",  
        min:1,  
        max:20,  
        value:5,  
        showValue:true,  
        step:1                
      });
    }

    if (this.properties.isReqItemDur) {
      itemDurationConfig = PropertyPaneSlider('itemDuration',{  
        label:"Time to cycle",  
        min:1,  
        max:20,  
        value:7,  
        showValue:true,  
        step:1                
      });
    }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneToggle('isReqItemLimit', {
                  label: 'Limit Billboards',
                  checked: true,
                }),
                itemLimitConfig,
                PropertyPaneToggle('isReqItemDur', {
                  label: 'Cycle Billboards',
                  checked: true,
                }),
                itemDurationConfig,
                PropertyPaneCheckbox('includeTitle', {  
                  text: "Include Title",
                  checked: false,
                }) 
              ]
            }
          ]
        }
      ]
    };
  }
}
